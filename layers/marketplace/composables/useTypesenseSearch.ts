import { ref, computed, watch, onUnmounted, nextTick } from 'vue';
import { useDebounceFn } from '@vueuse/core';
import { getTypesenseService } from '~/layers/marketplace/services/typesenseService';

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

interface UseTypesenseSearchOptions {
	indexName: string;
	searchConfig: SearchConfig;
	sortOptions: SortOption[];
	filterAttributes?: FilterAttribute[];
	debounceMs?: number;
	initialState?: Partial<SearchState>;
	initialData?: SearchResult | null;
}

export function useTypesenseSearch(options: UseTypesenseSearchOptions) {
	const {
		indexName,
		searchConfig,
		sortOptions,
		filterAttributes = [],
		debounceMs = 300,
		initialState = {},
		initialData,
	} = options;

	const typesenseService = getTypesenseService();

	const state = ref<SearchState>({
		query: initialState.query || '',
		filters: initialState.filters || {},
		sort: initialState.sort || sortOptions[0]?.value || searchConfig.sort_by || '',
		page: initialState.page || 1,
		hitsPerPage: initialState.hitsPerPage || searchConfig.per_page || 20,
	});

	const results = ref<SearchResult | null>(initialData || null);
	const loading = ref(false);
	const error = ref<Error | null>(null);

	const abortController = ref<AbortController | null>(null);

	const hasActiveFilters = computed(() => {
		return Object.values(state.value.filters).some((values) => values.length > 0);
	});

	const hasSearchQuery = computed(() => state.value.query.length > 0);

	const canClearAll = computed(() => hasActiveFilters.value || hasSearchQuery.value);

	// Pagination
	const totalPages = computed(() => {
		if (!results.value) return 0;
		return Math.ceil(results.value.found / state.value.hitsPerPage);
	});

	const paginationPages = computed(() => {
		const current = state.value.page;
		const total = totalPages.value;
		const pages: (number | string)[] = [];

		// Simple pagination - just show current page and adjacent pages
		if (total <= 3) {
			// Show all pages if 3 or fewer
			for (let i = 1; i <= total; i++) {
				pages.push(i);
			}
		} else {
			// Show current page and one on each side
			if (current === 1) {
				// At start: show 1, 2, 3
				pages.push(1, 2, 3);
			} else if (current === total) {
				// At end: show n-2, n-1, n
				pages.push(total - 2, total - 1, total);
			} else {
				// In middle: show current-1, current, current+1
				pages.push(current - 1, current, current + 1);
			}
		}

		return pages;
	});

	const hasPreviousPage = computed(() => state.value.page > 1);
	const hasNextPage = computed(() => state.value.page < totalPages.value);

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

	const lastSearchTrigger = ref<'query' | 'filter' | 'sort' | 'page' | 'init'>('init');

	async function executeSearch(trigger: 'query' | 'filter' | 'sort' | 'page' | 'init' = 'init') {
		// Cancel previous request if still pending
		if (abortController.value) {
			abortController.value.abort();
		}

		abortController.value = new AbortController();

		// Only show loading for certain triggers
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
			// Ignore aborted requests
			if (err instanceof Error && err.name === 'AbortError') {
				return;
			}

			error.value = err as Error;
			// eslint-disable-next-line no-console
			console.error('Search error:', err);
		} finally {
			loading.value = false;
		}
	}

	// Flag to prevent cascading watcher triggers
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
			resetPageAndPreventCascade(); // Reset to first page on query change
			debouncedSearch();
		},
	);

	watch(
		() => state.value.filters,
		() => {
			resetPageAndPreventCascade(); // Reset to first page on filter change
			executeSearch('filter');
		},
		{ deep: true },
	);

	watch(
		() => state.value.sort,
		() => {
			resetPageAndPreventCascade(); // Reset to first page on sort change
			executeSearch('sort');
		},
	);

	watch(
		() => state.value.page,
		() => {
			// Don't trigger search if this is an internal page reset
			if (!isInternalPageReset) {
				executeSearch('page');
			}
		},
	);

	function setQuery(query: string) {
		state.value.query = query;
	}

	function setFilter(attribute: string, values: string[]) {
		state.value.filters[attribute] = values;
	}

	function toggleFilter(attribute: string, value: string) {
		const currentValues = state.value.filters[attribute] || [];
		const index = currentValues.indexOf(value);

		if (index === -1) {
			// Add value
			state.value.filters[attribute] = [...currentValues, value];
		} else {
			// Remove value
			const newValues = currentValues.filter((v) => v !== value);

			if (newValues.length === 0) {
				delete state.value.filters[attribute];
			} else {
				state.value.filters[attribute] = newValues;
			}
		}
	}

	function setSort(sort: string) {
		state.value.sort = sort;
	}

	function setPage(page: number) {
		state.value.page = page;
	}

	function clearAll() {
		state.value.query = '';
		state.value.filters = {};
		state.value.page = 1;
	}

	function clearFilters() {
		state.value.filters = {};
		state.value.page = 1;
	}

	function setFilters(filters: Record<string, string[]>) {
		// Set all filters at once and reset to first page
		state.value.filters = filters;
		state.value.page = 1;
	}

	function initialize() {
		executeSearch('init');
	}

	// Get facet results for an attribute
	function getFacetResults(attribute: string) {
		return results.value?.facets[attribute] || [];
	}

	// Cleanup on unmount
	onUnmounted(() => {
		// Cancel any pending search requests
		if (abortController.value) {
			abortController.value.abort();
			abortController.value = null;
		}
	});

	return {
		// State
		state,
		results: readonly(results),
		loading: readonly(loading),
		error: readonly(error),
		lastSearchTrigger: readonly(lastSearchTrigger),

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
		toggleFilter,
		setSort,
		setPage,
		clearAll,
		clearFilters,
		setFilters,
		initialize,
		executeSearch,
		goToPreviousPage,
		goToNextPage,
		getFacetResults,
	};
}
