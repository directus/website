import { ref, computed, watch } from 'vue';
import { debounce } from 'perfect-debounce';

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
	hits: any[];
	facets: Record<string, FacetResult[]>;
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
}

export function useTypesenseSearch(options: UseTypesenseSearchOptions) {
	const { indexName, searchConfig, sortOptions, filterAttributes = [], debounceMs = 300, initialState = {} } = options;

	const config = useRuntimeConfig();
	const { typesenseUrl, typesensePublicApiKey } = config.public;
	const typesenseNode = computed(() => parseTypesenseUrl(typesenseUrl));

	// Search state
	const state = ref<SearchState>({
		query: initialState.query || '',
		filters: initialState.filters || {},
		sort: initialState.sort || sortOptions[0]?.value || searchConfig.sort_by || '',
		page: initialState.page || 1,
		hitsPerPage: initialState.hitsPerPage || searchConfig.per_page || 20,
	});

	// Results state
	const results = ref<SearchResult | null>(null);
	const loading = ref(false);
	const error = ref<Error | null>(null);

	// Computed properties
	const hasActiveFilters = computed(() => {
		return Object.values(state.value.filters).some((values) => values.length > 0);
	});

	const hasSearchQuery = computed(() => state.value.query.length > 0);

	const canClearAll = computed(() => hasActiveFilters.value || hasSearchQuery.value);

	// Build Typesense search parameters
	const buildSearchParams = (excludeFilterForAttribute?: string) => {
		const params: any = {
			q: state.value.query || '*',
			query_by: searchConfig.query_by,
			page: state.value.page,
			per_page: state.value.hitsPerPage,
		};

		// Add faceting
		if (searchConfig.facet_by) {
			params.facet_by = searchConfig.facet_by;
		}

		// Add sorting
		if (state.value.sort) {
			params.sort_by = state.value.sort;
		} else if (searchConfig.sort_by) {
			params.sort_by = searchConfig.sort_by;
		}

		// Build filter query
		const filterParts: string[] = [];

		// Add configured filters
		if (searchConfig.filter_by) {
			filterParts.push(searchConfig.filter_by);
		}

		// Add dynamic filters from state (excluding the specified attribute if provided)
		Object.entries(state.value.filters).forEach(([attribute, values]) => {
			if (values.length > 0 && attribute !== excludeFilterForAttribute) {
				const filterQuery = values.map((value) => `${attribute}:=${value}`).join(' || ');
				filterParts.push(`(${filterQuery})`);
			}
		});

		if (filterParts.length > 0) {
			params.filter_by = filterParts.join(' && ');
		}

		return params;
	};

	// Track what triggered the search
	const lastSearchTrigger = ref<'query' | 'filter' | 'sort' | 'page' | 'init'>('init');

	// Execute search using multi-search for proper facet handling
	const executeSearch = async (trigger: 'query' | 'filter' | 'sort' | 'page' | 'init' = 'init') => {
		// Only show loading for certain triggers
		if (trigger === 'query' || trigger === 'filter' || trigger === 'init') {
			loading.value = true;
		}

		error.value = null;
		lastSearchTrigger.value = trigger;

		// Start timing the request
		const requestStartTime = performance.now();

		try {
			// Build the main search query
			const mainSearchParams = buildSearchParams();

			// Create queries array for multi-search
			const searches: any[] = [
				{
					...mainSearchParams,
					collection: indexName,
				},
			];

			// If we have active filters, add additional queries for each facet attribute
			// to get proper facet counts (excluding each filter individually)
			const facetQueries: Record<string, number> = {};

			if (hasActiveFilters.value && filterAttributes.length > 0) {
				filterAttributes.forEach((attr) => {
					if (state.value.filters[attr.attribute]?.length > 0) {
						// Create a query that excludes only this attribute's filter
						const facetSearchParams = buildSearchParams(attr.attribute);

						// Only include faceting for this specific attribute
						const facetOnlyParams = {
							...facetSearchParams,
							collection: indexName,
							facet_by: attr.attribute,
							per_page: 0, // We only need facets, not hits
						};

						facetQueries[attr.attribute] = searches.length;
						searches.push(facetOnlyParams);
					}
				});
			}

			// Use multi-search if we have multiple queries, otherwise single search
			let response;

			if (searches.length > 1) {
				const multiSearchUrl = `https://${typesenseNode.value.host}:${typesenseNode.value.port}/multi_search`;

				response = await fetch(multiSearchUrl, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						'X-TYPESENSE-API-KEY': typesensePublicApiKey,
					},
					body: JSON.stringify({ searches }),
				});
			} else {
				// Single search
				const url = new URL(
					`https://${typesenseNode.value.host}:${typesenseNode.value.port}/collections/${indexName}/documents/search`,
				);

				Object.entries(mainSearchParams).forEach(([key, value]) => {
					url.searchParams.append(key, String(value));
				});

				response = await fetch(url.toString(), {
					headers: {
						'X-TYPESENSE-API-KEY': typesensePublicApiKey,
					},
				});
			}

			if (!response.ok) {
				throw new Error(`Search failed: ${response.statusText}`);
			}

			const responseData = await response.json();

			// Handle multi-search vs single search response
			const mainResult = searches.length > 1 ? responseData.results[0] : responseData;
			const facetResults = searches.length > 1 ? responseData.results.slice(1) : [];

			// Transform main search facets
			const mainFacets: Record<string, FacetResult[]> = {};

			if (mainResult.facet_counts) {
				mainResult.facet_counts.forEach((facetCount: any) => {
					mainFacets[facetCount.field_name] = facetCount.counts.map((count: any) => ({
						value: count.value,
						count: count.count,
						highlighted: count.highlighted,
					}));
				});
			}

			// Merge with additional facet queries
			const mergedFacets: Record<string, FacetResult[]> = { ...mainFacets };

			Object.entries(facetQueries).forEach(([attribute, queryIndex]) => {
				const facetResult = facetResults[queryIndex - 1]; // Adjust for 0-based index

				if (facetResult && facetResult.facet_counts) {
					const facetCount = facetResult.facet_counts.find((fc: any) => fc.field_name === attribute);

					if (facetCount) {
						const unfiltered = facetCount.counts.map((count: any) => ({
							value: count.value,
							count: count.count,
							highlighted: count.highlighted,
						}));

						// Merge with main facets, prioritizing active filters
						const activeFilters = state.value.filters[attribute] || [];

						mergedFacets[attribute] = unfiltered
							.map((facetValue: FacetResult) => {
								const isActive = activeFilters.includes(facetValue.value);

								return {
									value: facetValue.value,
									count: facetValue.count,
									highlighted: facetValue.highlighted,
									_isActive: isActive,
								} as FacetResult & { _isActive?: boolean };
							})
							.sort((a: FacetResult & { _isActive?: boolean }, b: FacetResult & { _isActive?: boolean }) => {
								// Active facets first
								if (a._isActive && !b._isActive) return -1;
								if (!a._isActive && b._isActive) return 1;
								// Then by count
								return b.count - a.count;
							})
							.map(({ _isActive, ...facet }: FacetResult & { _isActive?: boolean }) => facet);
					}
				}
			});

			// Calculate total request time
			const requestEndTime = performance.now();
			const requestTimeMs = Math.round(requestEndTime - requestStartTime);

			results.value = {
				hits: mainResult.hits?.map((hit: any) => hit.document) || [],
				facets: mergedFacets,
				found: mainResult.found || 0,
				search_time_ms: requestTimeMs,
				page: mainResult.page || 1,
				out_of: mainResult.out_of || 0,
			};
		} catch (err) {
			error.value = err as Error;
			// eslint-disable-next-line no-console
			console.error('Search error:', err);
		} finally {
			loading.value = false;
		}
	};

	// Debounced search
	const debouncedSearch = debounce(() => executeSearch('query'), debounceMs);

	// Watch for state changes and trigger search
	watch(
		() => state.value.query,
		() => {
			state.value.page = 1; // Reset to first page on query change
			debouncedSearch();
		},
	);

	watch(
		() => state.value.filters,
		() => {
			state.value.page = 1; // Reset to first page on filter change
			executeSearch('filter');
		},
		{ deep: true },
	);

	watch(
		() => state.value.sort,
		() => {
			state.value.page = 1; // Reset to first page on sort change
			executeSearch('sort');
		},
	);

	watch(
		() => state.value.page,
		() => {
			executeSearch('page');
		},
	);

	// Actions
	const setQuery = (query: string) => {
		state.value.query = query;
	};

	const setFilter = (attribute: string, values: string[]) => {
		state.value.filters[attribute] = values;
	};

	const toggleFilter = (attribute: string, value: string) => {
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
	};

	const setSort = (sort: string) => {
		state.value.sort = sort;
	};

	const setPage = (page: number) => {
		state.value.page = page;
	};

	const clearAll = () => {
		state.value.query = '';
		state.value.filters = {};
		state.value.page = 1;
	};

	const clearFilters = () => {
		state.value.filters = {};
		state.value.page = 1;
	};

	const setFilters = (filters: Record<string, string[]>) => {
		// Set all filters at once without resetting page
		state.value.filters = filters;
	};

	// Initialize search on mount
	const initialize = () => {
		executeSearch('init');
	};

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
	};
}

