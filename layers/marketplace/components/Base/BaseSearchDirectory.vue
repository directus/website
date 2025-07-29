<script setup lang="ts">
import {
	AisInstantSearchSsr,
	AisSearchBox,
	AisRefinementList,
	AisHits,
	AisPagination,
	AisConfigure,
	AisClearRefinements,
	AisSortBy,
	AisStateResults,
	createServerRootMixin,
} from 'vue-instantsearch/vue3/es';
import { renderToString } from 'vue/server-renderer';
import { h } from 'vue';
import { history } from 'instantsearch.js/es/lib/routers';

interface FilterAttribute {
	attribute: string;
	label: string;
	showMore?: boolean;
}

interface SortOption {
	value: string;
	label: string;
}

interface SearchConfig {
	query_by: string;
	facet_by?: string;
	sort_by?: string;
	per_page?: number;
	filter_by?: string;
}

interface Props {
	indexName: string;
	searchConfig: SearchConfig;
	searchPlaceholder?: string;
	sortOptions: SortOption[];
	filterAttributes?: FilterAttribute[];
	showFilters?: boolean;
	showSort?: boolean;
	hitsPerPage?: number;
}

const props = withDefaults(defineProps<Props>(), {
	searchPlaceholder: 'Search...',
	showFilters: true,
	showSort: true,
	hitsPerPage: 20,
	filterAttributes: () => [],
});

const { searchClient } = useTypesense(props.searchConfig);

// Create custom state mapping for clean URLs
const createCustomStateMapping = (
	indexName: string,
	filterAttributes: FilterAttribute[],
	sortOptions: SortOption[],
) => ({
	stateToRoute(uiState: any) {
		const indexUiState = uiState[indexName] || {};
		const routeState: Record<string, string> = {};

		// Map query to 'q'
		if (indexUiState.query) {
			routeState.q = indexUiState.query;
		}

		// Map refinement lists to their attribute names
		if (indexUiState.refinementList) {
			Object.keys(indexUiState.refinementList).forEach((attribute) => {
				const values = indexUiState.refinementList[attribute];

				if (values && values.length > 0) {
					routeState[attribute] = values.join(',');
				}
			});
		}

		// Map sort by to 'sort' (only if not default)
		if (indexUiState.sortBy && sortOptions.length > 0) {
			const defaultSort = sortOptions[0]?.value;

			if (indexUiState.sortBy !== defaultSort) {
				// Extract the sort parameter from the full index/sort/parameter format
				const sortValue = indexUiState.sortBy.replace(`${indexName}/sort/`, '');
				routeState.sort = sortValue;
			}
		}

		// Map page (only if not page 1)
		if (indexUiState.page && indexUiState.page > 1) {
			routeState.page = indexUiState.page.toString();
		}

		return routeState;
	},

	routeToState(routeState: Record<string, string>) {
		const uiState: any = {};
		const indexState: any = {};

		// Map 'q' to query
		if (routeState.q) {
			indexState.query = routeState.q;
		}

		// Map attribute parameters to refinement lists
		filterAttributes.forEach((attr) => {
			if (routeState[attr.attribute]) {
				indexState.refinementList = indexState.refinementList || {};
				indexState.refinementList[attr.attribute] = routeState[attr.attribute].split(',');
			}
		});

		// Map 'sort' to sortBy, or set default if no sort parameter
		if (routeState.sort) {
			indexState.sortBy = `${indexName}/sort/${routeState.sort}`;
		} else if (sortOptions.length > 0) {
			// Set default sort when no sort parameter is present
			indexState.sortBy = sortOptions[0].value;
		}

		// Map page
		if (routeState.page) {
			indexState.page = parseInt(routeState.page, 10);
		}

		if (Object.keys(indexState).length > 0) {
			uiState[indexName] = indexState;
		}

		return uiState;
	},
});

const url = useRequestURL();

const isFilterOpen = ref(false);

const searchRefine = ref<((value: string) => void) | null>(null);

// Create router configuration for URL state management
const routing = {
	router: history({
		getLocation() {
			if (import.meta.server) {
				return new URL(url.href) as unknown as Location;
			}

			return window.location;
		},
	}),
	stateMapping: createCustomStateMapping(props.indexName, props.filterAttributes, props.sortOptions),
};

const serverRootMixin = ref(
	createServerRootMixin({
		searchClient: searchClient as any,
		indexName: props.indexName,
		routing,
		future: {
			preserveSharedStateOnUnmount: true,
		},
	}),
);

const { instantsearch } = serverRootMixin.value.data();
provide('$_ais_ssrInstantSearchInstance', instantsearch);

const { data: searchState } = await useAsyncData(`search-state-${props.indexName}`, async () => {
	return instantsearch.findResultsState({
		component: {
			$options: {
				components: {
					AisInstantSearchSsr,
					AisConfigure,
					AisSearchBox,
					AisRefinementList,
					AisHits,
					AisPagination,
					AisClearRefinements,
					AisSortBy,
					AisStateResults,
				},
				data() {
					return { instantsearch };
				},
				provide: { $_ais_ssrInstantSearchInstance: instantsearch },
				render() {
					return h(AisInstantSearchSsr, {}, () => [
						h(AisConfigure, { hitsPerPage: props.hitsPerPage }),
						h(AisSearchBox),
						...props.filterAttributes.map((attr) => h(AisRefinementList, { attribute: attr.attribute })),
						...(props.showSort && props.sortOptions.length > 0
							? [h(AisSortBy, { items: props.sortOptions as any })]
							: []),
						h(AisHits),
						h(AisPagination),
						h(AisClearRefinements),
						h(AisStateResults),
					]);
				},
			},
		},
		renderToString,
	});
});

onBeforeMount(() => {
	if (searchState.value) {
		instantsearch.hydrate(searchState.value);
	}
});

function toggleFilter() {
	isFilterOpen.value = !isFilterOpen.value;
}

function clearAll(clearRefinements: () => void) {
	if (searchRefine.value) {
		searchRefine.value('');
	}

	clearRefinements();
}
</script>

<template>
	<div class="search-directory">
		<AisInstantSearchSsr :search-client="searchClient" :index-name="indexName" :routing="routing">
			<AisConfigure :hits-per-page.camel="hitsPerPage" />
			<div class="directory">
				<aside v-if="showFilters || showSort">
					<div class="form">
						<slot name="search-prepend" />

						<BaseFormGroup>
							<AisSearchBox :placeholder="searchPlaceholder">
								<template #default="{ currentRefinement, refine }">
									<BaseInput
										:model-value="currentRefinement"
										@update:model-value="refine"
										type="search"
										:placeholder="searchPlaceholder"
										prepend-icon="search"
										autofocus
										@vue:mounted="searchRefine = refine"
									/>
								</template>
							</AisSearchBox>
						</BaseFormGroup>

						<slot name="search-append" />

						<BaseFormGroup v-if="showSort && sortOptions.length > 0" label="Sort by">
							<AisSortBy :items="sortOptions">
								<template #default="{ items, currentRefinement, refine }">
									<BaseSelect :model-value="currentRefinement" :options="items" @update:model-value="refine" />
								</template>
							</AisSortBy>
						</BaseFormGroup>

						<div class="filter-controls" v-if="showFilters && filterAttributes.length > 0">
							<BaseButton
								color="secondary"
								:label="isFilterOpen ? 'Hide Filters' : 'Show Filters'"
								outline
								class="mobile-only toggle-filter"
								icon="filter-alt"
								@click="toggleFilter()"
							/>
							<AisStateResults>
								<template #default="{ state }">
									<AisClearRefinements>
										<template #default="{ canRefine, refine }">
											<BaseButton
												v-if="canRefine || state?.query"
												color="secondary"
												label="Clear Filters"
												outline
												icon="close"
												class="clear-filter"
												@click="clearAll(refine)"
											/>
											<span v-else />
										</template>
									</AisClearRefinements>
								</template>
							</AisStateResults>
						</div>

						<slot name="filters-top" />

						<div
							v-if="showFilters && filterAttributes.length > 0"
							class="facets"
							:class="{ 'mobile-hidden': !isFilterOpen }"
						>
							<BaseFormGroup
								v-for="filterAttr in filterAttributes"
								:key="filterAttr.attribute"
								:label="filterAttr.label"
							>
								<AisRefinementList :attribute="filterAttr.attribute" :show-more="filterAttr.showMore || false">
									<template #default="{ items, refine }">
										<BaseCheckboxGroup
											:options="
												items.map((item: any) => ({
													label: `${item.label} (${item.count})`,
													value: item.value,
												}))
											"
											:model-value="items.filter((item: any) => item.isRefined).map((item: any) => item.value)"
											@update:model-value="
												(values: string[]) => {
													items.forEach((item: any) => {
														if (values.includes(item.value) !== item.isRefined) {
															refine(item.value);
														}
													});
												}
											"
										/>
									</template>
								</AisRefinementList>
							</BaseFormGroup>
						</div>

						<slot name="filters-bottom" />
					</div>
				</aside>

				<main>
					<AisHits>
						<template #default="{ items, isSearchStalled }">
							<div v-if="isSearchStalled" class="search-indicator">
								<BaseIcon name="search" class="search-icon" />
								<span>Searching...</span>
							</div>
							<slot name="results" :items="items" :is-search-stalled="isSearchStalled" />
						</template>
						<template #empty>
							<slot name="empty">
								<p class="no-results">No results were found. Try changing the search criteria.</p>
							</slot>
						</template>
					</AisHits>

					<AisPagination :padding="2" />
				</main>
			</div>
		</AisInstantSearchSsr>
	</div>
</template>

<style lang="scss" scoped>
.search-directory {
	container-type: inline-size;
	position: relative;

	&.first-block {
		padding-block-start: 0;
	}

	&.narrow {
		grid-column: narrow;
	}

	&.full {
		grid-column: full;
	}
}

.directory {
	display: grid;
	grid-template-columns: 1fr;
	gap: var(--space-10);

	@container (width > 72rem) {
		grid-template-columns: var(--space-64) 1fr;
	}
}

.form {
	position: sticky;
	top: var(--space-28);
	padding-inline: var(--space-4);
	display: grid;
	grid-template-areas:
		'search'
		'sort'
		'controls'
		'facets';
	gap: var(--space-4);

	@container (width > 72rem) {
		grid-template-areas:
			'search'
			'sort'
			'facets'
			'controls';
	}

	:deep(.ais-SearchBox) {
		grid-area: search;
	}

	:deep(.ais-SortBy) {
		grid-area: sort;
	}

	.filter-controls {
		grid-area: controls;
		display: flex;
		justify-content: space-between;
	}

	.facets {
		grid-area: facets;
		display: grid;
		gap: var(--space-4);

		@container (width <= 72rem) {
			&.mobile-hidden {
				display: none;
			}
		}
	}
}

.mobile-only {
	@container (width > 72rem) {
		display: none;
	}
}

.toggle-filter {
	@container (width > 72rem) {
		display: none;
	}
}

.clear-filter {
	@container (width <= 72rem) {
		justify-self: end;
	}
}

.search-indicator {
	display: flex;
	align-items: center;
	gap: var(--space-2);
	color: var(--gray-500);
	font-size: var(--font-size-sm);
	margin-bottom: var(--space-4);

	.search-icon {
		width: var(--space-4);
		height: var(--space-4);
		animation: pulse 1.5s ease-in-out infinite;
	}
}

@keyframes pulse {
	0%,
	100% {
		opacity: 1;
	}
	50% {
		opacity: 0.5;
	}
}

.no-results {
	text-align: center;
	color: var(--gray-600);
	font-size: var(--font-size-lg);
	margin: var(--space-16) 0;
}

:deep(.ais-Pagination) {
	margin-top: var(--space-8);

	.ais-Pagination-list {
		display: flex;
		justify-content: center;
		gap: var(--space-2);
		list-style: none;
		padding: 0;
		margin: 0;
		flex-wrap: wrap;
		max-width: 100%;
	}

	.ais-Pagination-item {
		display: inline-block;
	}

	.ais-Pagination-link {
		display: flex;
		align-items: center;
		justify-content: center;
		min-width: var(--space-8);
		height: var(--space-8);
		padding: 0 var(--space-2);
		border: 1px solid var(--gray-200);
		border-radius: var(--rounded-md);
		color: var(--gray-700);
		text-decoration: none;
		font-size: var(--font-size-xs);

		@container (width > 40rem) {
			min-width: var(--space-10);
			height: var(--space-10);
			padding: 0 var(--space-3);
			font-size: var(--font-size-sm);
		}

		&:hover {
			border-color: var(--primary);
			color: var(--primary);
		}

		&[aria-current='page'],
		&.ais-Pagination-link--current {
			background-color: var(--primary) !important;
			border-color: var(--primary) !important;
			color: var(--background) !important;
			font-weight: 600;
		}
	}

	.ais-Pagination-item--selected .ais-Pagination-link {
		background-color: var(--primary) !important;
		border-color: var(--primary) !important;
		color: var(--background) !important;
		font-weight: 600;
	}
}
</style>
