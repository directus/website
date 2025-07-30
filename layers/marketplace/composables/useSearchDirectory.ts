import { ref, computed, watch, onMounted, onUnmounted, nextTick, shallowRef, toRaw } from 'vue';
import { useDebounceFn } from '@vueuse/core';
import { getTypesenseService } from '~/layers/marketplace/services/typesenseService';
import { parseSearchURLState } from '~/layers/marketplace/utils/parse-search-url-state';

export interface SearchState {
	query: string;
	filters: Record<string, string[]>;
	sort: string;
	page: number;
	hitsPerPage: number;
}

export interface SearchConfig {
	query_by: string;
	facet_by?: string;
	sort_by?: string;
	per_page?: number;
	filter_by?: string;
}

export interface SearchResult {
	hits: readonly any[];
	facets: Record<string, readonly FacetResult[]>;
	found: number;
	search_time_ms: number;
	page: number;
	out_of: number;
}

export interface FacetResult {
	value: string;
	count: number;
	highlighted?: string;
}

export interface SortOption {
	value: string;
	label: string;
}

export interface FilterAttribute {
	attribute: string;
	label: string;
	showMore?: boolean;
}

interface UseSearchDirectoryOptions {
	indexName: string;
	searchConfig: SearchConfig;
	sortOptions: SortOption[];
	filterAttributes?: FilterAttribute[];
	debounceMs?: number;
	initialData?: SearchResult | null;
	initialState?: SearchState;
}

export function useSearchDirectory(options: UseSearchDirectoryOptions) {
	const {
		indexName,
		searchConfig,
		sortOptions,
		filterAttributes = [],
		debounceMs = 300,
		initialData,
		initialState,
	} = options;

	const route = useRoute();
	const router = useRouter();
	const typesenseService = getTypesenseService();

	let cachedInitialState: SearchState | null = null;
	let cachedMemoKey: string | null = null;

	const createInitialState = (): SearchState => {
		const memoKey = JSON.stringify(route.query);

		if (cachedInitialState && cachedMemoKey === memoKey) {
			return cachedInitialState;
		}

		const urlState = parseSearchURLState({
			query: route.query,
			filterAttributes,
			includeEmptyDefaults: false,
		});

		cachedInitialState = {
			query: urlState.query || '',
			filters: urlState.filters || {},
			sort: urlState.sort || sortOptions[0]?.value || searchConfig.sort_by || '',
			page: urlState.page || 1,
			hitsPerPage: urlState.hitsPerPage || searchConfig.per_page || 20,
		};

		cachedMemoKey = memoKey;

		return cachedInitialState;
	};

	type SearchTrigger = 'query' | 'filter' | 'sort' | 'page' | 'init';

	const finalInitialState = initialState || createInitialState();
	const state = ref<SearchState>(finalInitialState);
	const results = shallowRef<SearchResult | null>(initialData || null);
	const loading = ref(false);
	const error = shallowRef<Error | null>(null);
	const abortController = ref<AbortController | null>(null);
	const lastSearchTrigger = ref<SearchTrigger>('init');

	// Force re-render key for hydration mismatches
	const renderKey = ref(0);

	// Computed properties
	const hasActiveFilters = computed(() => {
		return Object.values(state.value.filters).some((values) => values.length > 0);
	});

	const hasSearchQuery = computed(() => state.value.query.length > 0);
	const canClearAll = computed(() => hasActiveFilters.value || hasSearchQuery.value);

	const totalPages = computed(() => {
		if (!results.value) return 0;
		return Math.ceil(results.value.found / state.value.hitsPerPage);
	});

	const hasPreviousPage = computed(() => state.value.page > 1);
	const hasNextPage = computed(() => state.value.page < totalPages.value);

	const paginationPages = computed(() => {
		const current = state.value.page;
		const total = totalPages.value;

		if (total <= 3) {
			return Array.from({ length: total }, (_, i) => i + 1);
		}

		if (current === 1) return [1, 2, 3];
		if (current === total) return [total - 2, total - 1, total];
		return [current - 1, current, current + 1];
	});

	// URL synchronization
	const isUpdatingURL = ref(false);

	const updateURL = useDebounceFn(() => {
		const query: Record<string, string> = {};

		// Add search query
		if (state.value.query) {
			query.q = state.value.query;
		}

		for (const [attribute, values] of Object.entries(state.value.filters)) {
			if (values.length > 0) {
				query[attribute] = values.join(',');
			}
		}

		// Add non-default values only
		const defaultSort = sortOptions[0]?.value || '';

		if (state.value.sort && state.value.sort !== defaultSort) {
			query.sort = state.value.sort;
		}

		if (state.value.page > 1) {
			query.page = String(state.value.page);
		}

		isUpdatingURL.value = true;

		router.replace({ path: route.path, query }).finally(() => {
			isUpdatingURL.value = false;
		});
	}, 50);

	// Search execution
	function executeSearch(trigger: SearchTrigger = 'init') {
		const controller = new AbortController();
		abortController.value?.abort();
		abortController.value = controller;

		// Only show loading for significant changes
		if (['query', 'filter', 'init'].includes(trigger)) {
			loading.value = true;
		}

		error.value = null;
		lastSearchTrigger.value = trigger;

		return typesenseService
			.search(
				{
					indexName,
					searchConfig,
					state: state.value,
					filterAttributes,
				},
				controller.signal,
			)
			.then((searchResult) => {
				// Only update if this request wasn't aborted
				if (!controller.signal.aborted) {
					results.value = searchResult;
				}
			})
			.catch((err) => {
				if (!controller.signal.aborted && err.name !== 'AbortError') {
					error.value = err;
				}
			})
			.finally(() => {
				if (!controller.signal.aborted) {
					loading.value = false;
				}
			});
	}

	let isInternalPageReset = false;

	const debouncedSearch = useDebounceFn(() => executeSearch('query'), debounceMs);

	// Consolidated watcher for state changes
	watch(
		() => ({
			query: state.value.query,
			filters: state.value.filters,
			sort: state.value.sort,
			page: state.value.page,
		}),
		(newVal, oldVal) => {
			// Deep compare filters properly (Vue 3 Proxy-safe)
			const filtersChanged = (() => {
				const newFilters = toRaw(newVal.filters);
				const oldFilters = toRaw(oldVal.filters);

				const newKeys = Object.keys(newFilters);
				const oldKeys = Object.keys(oldFilters);

				if (newKeys.length !== oldKeys.length) return true;

				for (const key of newKeys) {
					const newArr = newFilters[key] || [];
					const oldArr = oldFilters[key] || [];

					if (newArr.length !== oldArr.length) return true;
					if (newArr.some((val, i) => val !== oldArr[i])) return true;
				}

				return false;
			})();

			const changes = {
				query: newVal.query !== oldVal.query,
				filters: filtersChanged,
				sort: newVal.sort !== oldVal.sort,
				page: newVal.page !== oldVal.page,
			};

			// Reset page for query/filter/sort changes
			if ((changes.query || changes.filters || changes.sort) && !isInternalPageReset) {
				isInternalPageReset = true;
				state.value.page = 1;

				nextTick(() => {
					isInternalPageReset = false;
				});
			}

			// Execute search based on change type
			if (changes.query) {
				debouncedSearch();
			} else if (changes.filters || changes.sort) {
				executeSearch(changes.filters ? 'filter' : 'sort');
			} else if (changes.page && !isInternalPageReset) {
				executeSearch('page');
			}

			// Update URL
			updateURL();
		},
		{ deep: true },
	);

	// Watch for URL changes (browser navigation)
	watch(
		() => route.query,
		(newQuery) => {
			if (isUpdatingURL.value) return;

			const urlState = parseSearchURLState({
				query: newQuery,
				filterAttributes,
				includeEmptyDefaults: true,
			});

			// Quick equality check before deep comparison
			if (
				urlState.query === state.value.query &&
				urlState.sort === state.value.sort &&
				urlState.page === state.value.page &&
				JSON.stringify(urlState.filters) === JSON.stringify(state.value.filters)
			) {
				return;
			}

			// Apply changes
			Object.assign(state.value, {
				query: urlState.query || '',
				filters: urlState.filters || {},
				sort: urlState.sort || sortOptions[0]?.value || searchConfig.sort_by || '',
				page: urlState.page || 1,
			});
		},
		{ immediate: false },
	);

	// Action methods
	function setQuery(query: string) {
		state.value.query = query;
	}

	function setFilter(attribute: string, values: string[]) {
		// Create a new object/array reference to ensure reactivity
		state.value.filters = {
			...state.value.filters,
			[attribute]: [...values],
		};
	}

	function setFilters(filters: Record<string, string[]>) {
		state.value.filters = filters;
		state.value.page = 1;
	}

	function setSort(sort: string) {
		state.value.sort = sort;
	}

	function setPage(page: number) {
		state.value.page = page;
	}

	function goToPreviousPage() {
		if (hasPreviousPage.value) {
			setPage(state.value.page - 1);
		}
	}

	function goToNextPage() {
		if (hasNextPage.value) {
			setPage(state.value.page + 1);
		}
	}

	function clearAll() {
		state.value.query = '';
		state.value.filters = {};
		state.value.page = 1;
	}

	function initialize() {
		executeSearch('init');
	}

	function getFacetResults(attribute: string) {
		return results.value?.facets[attribute] || [];
	}

	// Handle prerendering mismatch on mount
	onMounted(() => {
		const hasURLParams = Object.keys(route.query).length > 0;
		const hasInitialData = !!initialData;

		// If we have URL params and initial data, check if we need to refresh
		// This handles prerendered pages where server data doesn't match URL params
		if (hasURLParams && hasInitialData) {
			// Force component re-render to fix hydration mismatch
			renderKey.value += 1;

			// Then search with fresh data
			nextTick(() => {
				initialize();
			});
		}
	});

	// Cleanup
	onUnmounted(() => {
		if (abortController.value) {
			abortController.value.abort();
			abortController.value = null;
		}
	});

	return {
		// State
		state: readonly(state),
		results: readonly(results),
		loading: readonly(loading),
		error: readonly(error),
		lastSearchTrigger: readonly(lastSearchTrigger),
		renderKey: readonly(renderKey),

		// Computed
		hasActiveFilters,
		hasSearchQuery,
		canClearAll,
		totalPages,
		paginationPages,
		hasPreviousPage,
		hasNextPage,

		// Actions
		setQuery,
		setFilter,
		setFilters,
		setSort,
		setPage,
		goToPreviousPage,
		goToNextPage,
		clearAll,
		initialize,
		getFacetResults,
	};
}
