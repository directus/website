import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue';
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

	const createInitialState = (): SearchState => {
		const urlState = parseSearchURLState({
			query: route.query,
			filterAttributes,
			includeEmptyDefaults: false,
		});

		return {
			query: urlState.query || '',
			filters: urlState.filters || {},
			sort: urlState.sort || sortOptions[0]?.value || searchConfig.sort_by || '',
			page: urlState.page || 1,
			hitsPerPage: urlState.hitsPerPage || searchConfig.per_page || 20,
		};
	};

	const finalInitialState = initialState || createInitialState();
	const state = ref<SearchState>(finalInitialState);
	const results = ref<SearchResult | null>(initialData || null);
	const loading = ref(false);
	const error = ref<Error | null>(null);
	const abortController = ref<AbortController | null>(null);
	const lastSearchTrigger = ref<'query' | 'filter' | 'sort' | 'page' | 'init'>('init');

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
		const pages: (number | string)[] = [];

		if (total <= 3) {
			for (let i = 1; i <= total; i++) {
				pages.push(i);
			}
		} else {
			if (current === 1) {
				pages.push(1, 2, 3);
			} else if (current === total) {
				pages.push(total - 2, total - 1, total);
			} else {
				pages.push(current - 1, current, current + 1);
			}
		}

		return pages;
	});

	// URL synchronization
	const isUpdatingURL = ref(false);
	let urlTimeoutId: NodeJS.Timeout | null = null;

	function updateURL() {
		const query: Record<string, string | string[]> = {};

		// Add search query
		if (state.value.query) {
			query.q = state.value.query;
		}

		// Add filters
		Object.entries(state.value.filters).forEach(([attribute, values]) => {
			if (values.length > 0) {
				query[attribute] = values.join(',');
			}
		});

		// Add sort (only if not default)
		const defaultSort = sortOptions[0]?.value || '';

		if (state.value.sort && state.value.sort !== defaultSort) {
			query.sort = state.value.sort;
		}

		// Add page (only if not 1)
		if (state.value.page > 1) {
			query.page = String(state.value.page);
		}

		// Update URL
		isUpdatingURL.value = true;

		router.replace({ path: route.path, query }).finally(() => {
			if (urlTimeoutId) clearTimeout(urlTimeoutId);

			urlTimeoutId = setTimeout(() => {
				isUpdatingURL.value = false;
				urlTimeoutId = null;
			}, 50);
		});
	}

	// Search execution
	async function executeSearch(trigger: 'query' | 'filter' | 'sort' | 'page' | 'init' = 'init') {
		if (abortController.value) {
			abortController.value.abort();
		}

		abortController.value = new AbortController();

		if (trigger === 'query' || trigger === 'filter' || trigger === 'init') {
			loading.value = true;
		}

		error.value = null;
		lastSearchTrigger.value = trigger;

		try {
			const searchResult = await typesenseService.search(
				{
					indexName,
					searchConfig,
					state: state.value,
					filterAttributes,
				},
				abortController.value.signal,
			);

			results.value = searchResult;
		} catch (err) {
			if (err instanceof Error && err.name === 'AbortError') {
				return;
			}

			error.value = err as Error;
		} finally {
			loading.value = false;
		}
	}

	// Page reset helper
	let isInternalPageReset = false;

	function resetPageAndPreventCascade() {
		isInternalPageReset = true;
		state.value.page = 1;

		nextTick(() => {
			isInternalPageReset = false;
		});
	}

	const debouncedSearch = useDebounceFn(() => executeSearch('query'), debounceMs);

	watch(
		() => state.value.query,
		() => {
			resetPageAndPreventCascade();
			debouncedSearch();
		},
	);

	watch(
		() => state.value.filters,
		() => {
			resetPageAndPreventCascade();
			executeSearch('filter');
		},
		{ deep: true },
	);

	watch(
		() => state.value.sort,
		() => {
			resetPageAndPreventCascade();
			executeSearch('sort');
		},
	);

	watch(
		() => state.value.page,
		() => {
			if (!isInternalPageReset) {
				executeSearch('page');
			}
		},
	);

	watch(state, updateURL, { deep: true });

	// Watch for URL changes (browser navigation)
	watch(
		() => route.query,
		() => {
			if (isUpdatingURL.value) return;

			const urlState = parseSearchURLState({
				query: route.query,
				filterAttributes,
				includeEmptyDefaults: true,
			});

			// Update state from URL
			const hasChanges =
				urlState.query !== state.value.query ||
				JSON.stringify(urlState.filters) !== JSON.stringify(state.value.filters) ||
				urlState.sort !== state.value.sort ||
				urlState.page !== state.value.page;

			if (hasChanges) {
				Object.assign(state.value, {
					query: urlState.query || '',
					filters: urlState.filters || {},
					sort: urlState.sort || sortOptions[0]?.value || searchConfig.sort_by || '',
					page: urlState.page || 1,
				});
			}
		},
		{ deep: true },
	);

	// Action methods
	function setQuery(query: string) {
		state.value.query = query;
	}

	function setFilter(attribute: string, values: string[]) {
		state.value.filters[attribute] = values;
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

		if (urlTimeoutId) {
			clearTimeout(urlTimeoutId);
			urlTimeoutId = null;
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
