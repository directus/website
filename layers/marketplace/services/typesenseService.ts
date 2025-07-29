import type {
	SearchState,
	SearchConfig,
	SearchResult,
	FacetResult,
	FilterAttribute,
} from '../composables/useTypesenseSearch';
import { parseTypesenseUrl } from '../utils/parse-typesense-url';

export interface TypesenseSearchParams {
	indexName: string;
	searchConfig: SearchConfig;
	state: SearchState;
	filterAttributes?: FilterAttribute[];
	excludeFilterForAttribute?: string;
}

export interface TypesenseServiceOptions {
	typesenseUrl: string;
	typesensePublicApiKey: string;
}

export class TypesenseService {
	private typesenseNode: { host: string; port: number; protocol: string };
	private typesensePublicApiKey: string;

	constructor(options: TypesenseServiceOptions) {
		this.typesenseNode = parseTypesenseUrl(options.typesenseUrl);
		this.typesensePublicApiKey = options.typesensePublicApiKey;
	}

	buildSearchParams(params: TypesenseSearchParams, excludeFilterForAttribute?: string) {
		const { searchConfig, state } = params;

		const searchParams: any = {
			q: state.query || '*',
			query_by: searchConfig.query_by,
			page: state.page,
			per_page: state.hitsPerPage,
		};

		// Add faceting
		if (searchConfig.facet_by) {
			searchParams.facet_by = searchConfig.facet_by;
		}

		// Add sorting
		if (state.sort) {
			searchParams.sort_by = state.sort;
		} else if (searchConfig.sort_by) {
			searchParams.sort_by = searchConfig.sort_by;
		}

		// Build filter query
		const filterParts: string[] = [];

		// Add configured filters
		if (searchConfig.filter_by) {
			filterParts.push(searchConfig.filter_by);
		}

		// Add dynamic filters from state (excluding the specified attribute if provided)
		Object.entries(state.filters).forEach(([attribute, values]) => {
			if (values.length > 0 && attribute !== excludeFilterForAttribute) {
				const filterQuery = values.map((value) => `${attribute}:=${value}`).join(' || ');
				filterParts.push(`(${filterQuery})`);
			}
		});

		if (filterParts.length > 0) {
			searchParams.filter_by = filterParts.join(' && ');
		}

		return searchParams;
	}

	async search(params: TypesenseSearchParams, signal?: AbortSignal): Promise<SearchResult> {
		const { indexName, filterAttributes = [] } = params;
		const requestStartTime = performance.now();

		// Build the main search query
		const mainSearchParams = this.buildSearchParams(params);

		// Create queries array for multi-search
		const searches: any[] = [
			{
				...mainSearchParams,
				collection: indexName,
			},
		];

		// If we have active filters, add additional queries for each facet attribute
		const facetQueries: Record<string, number> = {};
		const hasActiveFilters = Object.values(params.state.filters).some((values) => values.length > 0);

		if (hasActiveFilters && filterAttributes.length > 0) {
			filterAttributes.forEach((attr) => {
				if (params.state.filters[attr.attribute]?.length > 0) {
					// Create a query that excludes only this attribute's filter
					const facetSearchParams = this.buildSearchParams(params, attr.attribute);

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
		let responseData: any;

		if (searches.length > 1) {
			const multiSearchUrl = `https://${this.typesenseNode.host}:${this.typesenseNode.port}/multi_search`;

			responseData = await $fetch(multiSearchUrl, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'X-TYPESENSE-API-KEY': this.typesensePublicApiKey,
				},
				body: { searches },
				signal,
			});
		} else {
			// Single search
			const url = new URL(
				`https://${this.typesenseNode.host}:${this.typesenseNode.port}/collections/${indexName}/documents/search`,
			);

			Object.entries(mainSearchParams).forEach(([key, value]) => {
				url.searchParams.append(key, String(value));
			});

			responseData = await $fetch(url.toString(), {
				headers: {
					'X-TYPESENSE-API-KEY': this.typesensePublicApiKey,
				},
				signal,
			});
		}

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
					const activeFilters = params.state.filters[attribute] || [];

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

		return {
			hits: mainResult.hits?.map((hit: any) => hit.document) || [],
			facets: mergedFacets,
			found: mainResult.found || 0,
			search_time_ms: requestTimeMs,
			page: mainResult.page || 1,
			out_of: mainResult.out_of || 0,
		};
	}
}

let typesenseService: TypesenseService | null = null;

export function getTypesenseService(): TypesenseService {
	if (!typesenseService) {
		const config = useRuntimeConfig();

		typesenseService = new TypesenseService({
			typesenseUrl: config.public.typesenseUrl,
			typesensePublicApiKey: config.public.typesensePublicApiKey,
		});
	}

	return typesenseService;
}
