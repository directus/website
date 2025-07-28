<script setup lang="ts">
import {
	AisInstantSearch,
	AisSearchBox,
	AisRefinementList,
	AisHits,
	AisPagination,
	AisConfigure,
	AisClearRefinements,
	AisSortBy,
	AisStateResults,
} from 'vue-instantsearch/vue3/es';

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

const route = useRoute();
const router = useRouter();

const isFilterOpen = ref(false);

// Store refine functions for clear all functionality
const searchRefine = ref<Function>(() => {});
const facetRefine = ref<Function>(() => {});
const sortRefine = ref<Function>(() => {});
const paginationRefine = ref<Function>(() => {});

// Initialize URL params
const initialSearchQuery = ref((route.query.q as string) || '');
const initialPage = ref(parseInt(route.query.page as string) || 1);
const initialSort = ref((route.query.sort as string) || props.sortOptions[0]?.value || '');

// Build initial filter state from URL params
const initialFilters = computed(() => {
	const filters: Record<string, string[]> = {};

	props.filterAttributes.forEach((attr) => {
		const paramValue = route.query[attr.attribute] as string;

		if (paramValue) {
			filters[attr.attribute] = paramValue.split(',').filter(Boolean);
		}
	});

	return filters;
});

const initialUiState = computed(() => ({
	[props.indexName]: {
		query: initialSearchQuery.value,
		page: initialPage.value - 1, // InstantSearch uses 0-based indexing
		sortBy: initialSort.value,
		refinementList: initialFilters.value,
	},
}));

// Watch for route changes (browser back/forward)
watch(
	() => route.query,
	(newQuery) => {
		const query = (newQuery.q as string) || '';
		const page = parseInt(newQuery.page as string) || 1;
		const sort = (newQuery.sort as string) || props.sortOptions[0]?.value || '';

		// Update search if changed
		if (searchRefine.value && query !== initialSearchQuery.value) {
			searchRefine.value(query);
			initialSearchQuery.value = query;
		}

		// Update page if changed (convert to 0-based for InstantSearch)
		if (paginationRefine.value && page !== initialPage.value) {
			paginationRefine.value(page - 1);
			initialPage.value = page;
		}

		// Update sort if changed
		if (sortRefine.value && sort !== initialSort.value) {
			sortRefine.value(sort);
			initialSort.value = sort;
		}
	},
	{ deep: true },
);

let debounceTimer: NodeJS.Timeout;

onUnmounted(() => {
	clearTimeout(debounceTimer);
});

function toggleFilter() {
	isFilterOpen.value = !isFilterOpen.value;
}

function updateUrlParams(updates: Record<string, any>) {
	clearTimeout(debounceTimer);

	debounceTimer = setTimeout(() => {
		const currentQuery = { ...route.query };

		Object.entries(updates).forEach(([key, value]) => {
			if (value && value !== '' && value !== 0) {
				// For arrays, join with comma
				currentQuery[key] = Array.isArray(value) ? value.join(',') : String(value);
			} else {
				delete currentQuery[key];
			}
		});

		router.replace({ query: currentQuery });
	}, 300); // 300ms debounce
}

function handleSearchInput(query: string) {
	searchRefine.value(query);
	updateUrlParams({ q: query });
}

function handleSortChange(sortValue: string) {
	sortRefine.value(sortValue);
	updateUrlParams({ sort: sortValue, page: null });
}

function handlePageChange(page: number) {
	paginationRefine.value(page - 1);
	updateUrlParams({ page: page === 1 ? null : page });
}

function handleFilterChange(attribute: string, values: string[]) {
	const updates: Record<string, any> = { page: null };
	updates[attribute] = values.length > 0 ? values : null;
	updateUrlParams(updates);
}

function clearAllFilters() {
	searchRefine.value('');
	facetRefine.value();

	if (sortRefine.value) {
		sortRefine.value(props.sortOptions[0]?.value || '');
	}

	if (paginationRefine.value) {
		paginationRefine.value(0);
	}

	router.replace({ query: {} });
}
</script>

<template>
	<div class="search-directory">
		<AisInstantSearch :search-client="searchClient" :index-name="indexName" :initial-ui-state="initialUiState">
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
										@update:model-value="handleSearchInput"
										type="search"
										:placeholder="searchPlaceholder"
										prepend-icon="search"
										autofocus
									/>
									{{ (searchRefine = refine) && '' }}
								</template>
							</AisSearchBox>
						</BaseFormGroup>

						<slot name="search-append" />

						<BaseFormGroup v-if="showSort && sortOptions.length > 0" label="Sort by">
							<AisSortBy :items="sortOptions">
								<template #default="{ items, refine, currentRefinement }">
									<BaseSelect
										:model-value="currentRefinement?.value || items[0]?.value || ''"
										:options="items.map((item: any) => ({ label: item.label, value: item.value }))"
										@update:model-value="handleSortChange"
									/>
									{{ (sortRefine = refine) && '' }}
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
											{{ (facetRefine = refine) && '' }}
											<BaseButton
												v-if="canRefine || state?.query"
												color="secondary"
												label="Clear Filters"
												outline
												icon="close"
												class="clear-filter"
												@click="clearAllFilters"
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
													handleFilterChange(filterAttr.attribute, values);
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

					<AisPagination :padding="2">
						<template #default="{ pages, currentRefinement, refine, isFirstPage, isLastPage }">
							{{ (paginationRefine = refine) && '' }}
							<nav class="ais-Pagination" v-if="pages.length > 1">
								<ul class="ais-Pagination-list">
									<!-- Previous button -->
									<li v-if="!isFirstPage" class="ais-Pagination-item">
										<a
											href="#"
											class="ais-Pagination-link"
											@click.prevent="handlePageChange(currentRefinement)"
											aria-label="Previous page"
										>
											‹ Prev
										</a>
									</li>

									<!-- Page numbers -->
									<li v-for="page in pages" :key="page" class="ais-Pagination-item">
										<a
											href="#"
											:class="['ais-Pagination-link', { 'ais-Pagination-link--current': page === currentRefinement }]"
											@click.prevent="handlePageChange(page + 1)"
										>
											{{ page + 1 }}
										</a>
									</li>

									<!-- Next button -->
									<li v-if="!isLastPage" class="ais-Pagination-item">
										<a
											href="#"
											class="ais-Pagination-link"
											@click.prevent="handlePageChange(currentRefinement + 2)"
											aria-label="Next page"
										>
											Next ›
										</a>
									</li>
								</ul>
							</nav>
						</template>
					</AisPagination>
				</main>
			</div>
		</AisInstantSearch>
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
		transition: all var(--duration-150) var(--ease-out);

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
