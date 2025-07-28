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
import { useDebounceFn } from '@vueuse/core';

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
const isClientReady = ref(false);

const serverRootMixin = ref(
	createServerRootMixin({
		searchClient: searchClient as any,
		indexName: props.indexName,
		future: {
			preserveSharedStateOnUnmount: true,
		},
	}),
);

const { instantsearch } = serverRootMixin.value.data();
provide('$_ais_ssrInstantSearchInstance', instantsearch);

const { data: searchState } = await useAsyncData(`search-state-${props.indexName}`, async () => {
	// During SSR/prerendering, we don't have access to URL params, so we return a default state
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

const getUiStateFromUrl = () => {
	const query = route.query;

	const uiState: any = {
		[props.indexName]: {},
	};

	if (query.q) {
		uiState[props.indexName].query = query.q as string;
	}

	// Convert from 1-based to 0-based page numbering
	if (query.page) {
		const page = parseInt(query.page as string);

		if (!isNaN(page) && page > 0) {
			uiState[props.indexName].page = page - 1;
		}
	}

	if (query.sort) {
		uiState[props.indexName].sortBy = query.sort as string;
	}

	const refinementList: Record<string, string[]> = {};

	props.filterAttributes.forEach((attr) => {
		const paramValue = query[attr.attribute] as string;

		if (paramValue) {
			refinementList[attr.attribute] = paramValue.split(',').filter(Boolean);
		}
	});

	if (Object.keys(refinementList).length > 0) {
		uiState[props.indexName].refinementList = refinementList;
	}

	return uiState;
};

const initialUiState = computed(() => getUiStateFromUrl());

onBeforeMount(() => {
	if (searchState.value) {
		instantsearch.hydrate(searchState.value);
	}
});

const syncStateFromUrl = () => {
	const uiState = getUiStateFromUrl();

	if (Object.keys(uiState[props.indexName]).length > 0) {
		instantsearch.setUiState(uiState);
	}
};

onMounted(() => {
	// Apply URL state to InstantSearch after a short delay to ensure components are ready
	setTimeout(() => {
		syncStateFromUrl();
		isClientReady.value = true;
	});
});

watch(
	() => route.query,
	() => {
		if (!isClientReady.value) return;
		syncStateFromUrl();
	},
	{ deep: true },
);

// Debounced URL update function using VueUse
const updateUrlParams = useDebounceFn((updates: Record<string, any>) => {
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
}, 300);

function toggleFilter() {
	isFilterOpen.value = !isFilterOpen.value;
}

function handleSearchInput(query: string) {
	updateUrlParams({ q: query });
}

function handleSortChange(sortValue: string) {
	updateUrlParams({ sort: sortValue, page: null });
}

function handlePageChange(page: number) {
	updateUrlParams({ page: page === 1 ? null : page });
}

function handleFilterChange(attribute: string, values: string[]) {
	const updates: Record<string, any> = { page: null };
	updates[attribute] = values.length > 0 ? values : null;
	updateUrlParams(updates);
}

function clearAllFilters(refine: () => void) {
	if (refine) {
		refine();
	}

	router.replace({ query: {} });
}
</script>

<template>
	<div class="search-directory">
		<AisInstantSearchSsr :search-client="searchClient" :index-name="indexName" :initial-ui-state="initialUiState">
			<AisConfigure :hits-per-page.camel="hitsPerPage" />
			<div class="directory">
				<aside v-if="showFilters || showSort">
					<div class="form">
						<slot name="search-prepend" />

						<BaseFormGroup>
							<AisSearchBox :placeholder="searchPlaceholder">
								<template #default="{ currentRefinement }">
									<BaseInput
										:model-value="currentRefinement"
										@update:model-value="handleSearchInput"
										type="search"
										:placeholder="searchPlaceholder"
										prepend-icon="search"
										autofocus
									/>
								</template>
							</AisSearchBox>
						</BaseFormGroup>

						<slot name="search-append" />

						<BaseFormGroup v-if="showSort && sortOptions.length > 0" label="Sort by">
							<AisSortBy :items="sortOptions">
								<template #default="{ items, currentRefinement }">
									<BaseSelect
										:model-value="currentRefinement?.value || items[0]?.value || ''"
										:options="items.map((item: any) => ({ label: item.label, value: item.value }))"
										@update:model-value="handleSortChange"
									/>
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
												@click="clearAllFilters(refine)"
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
						<template #default="{ pages, currentRefinement, isFirstPage, isLastPage }">
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
