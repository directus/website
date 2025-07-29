<script setup lang="ts">
import { useTypesenseSearch } from '../../composables/useTypesenseSearch';
import { useSearchURLState } from '../../composables/useSearchURLState';
import { parseSearchURLState } from '../../utils/parseSearchURLState';
import type { SearchConfig, SortOption, FilterAttribute } from '../../composables/useTypesenseSearch';

interface Props {
	indexName: string;
	searchConfig: SearchConfig;
	searchPlaceholder?: string;
	sortOptions: SortOption[];
	filterAttributes?: FilterAttribute[];
	showFilters?: boolean;
	showSort?: boolean;
	hitsPerPage?: number;
	cacheKey?: string;
}

const props = withDefaults(defineProps<Props>(), {
	searchPlaceholder: 'Search...',
	showFilters: true,
	showSort: true,
	hitsPerPage: 20,
	filterAttributes: () => [],
	cacheKey: '',
});

// Get initial state from URL
const route = useRoute();

const getInitialState = () => {
	return parseSearchURLState({
		query: route.query,
		filterAttributes: props.filterAttributes,
		hitsPerPage: props.hitsPerPage,
		includeEmptyDefaults: false,
	});
};

// Server-side data fetching with useAsyncData
const { data: serverData } = await useAsyncData(props.cacheKey || `search-${props.indexName}`, async () => {
	if (!import.meta.server) return null;

	// Create temporary search instance for server-side execution
	const tempSearch = useTypesenseSearch({
		indexName: props.indexName,
		searchConfig: props.searchConfig,
		sortOptions: props.sortOptions,
		filterAttributes: props.filterAttributes,
		initialState: getInitialState(),
	});

	await tempSearch.executeSearch('init');
	return tempSearch.results.value;
});

// Initialize search with server data
const search = useTypesenseSearch({
	indexName: props.indexName,
	searchConfig: props.searchConfig,
	sortOptions: props.sortOptions,
	filterAttributes: props.filterAttributes,
	initialState: getInitialState(),
	initialData: serverData.value,
});

// Initialize URL state management
useSearchURLState({
	state: search.state,
	indexName: props.indexName,
	sortOptions: props.sortOptions,
	filterAttributes: props.filterAttributes,
	onStateChange: (newState) => {
		// Now that createStateFromURL always returns complete state, we can simplify this
		if (newState.query !== undefined) search.setQuery(newState.query);

		if (newState.filters !== undefined) {
			// Set all filters at once without triggering individual updates
			search.setFilters(newState.filters);
		}

		if (newState.sort !== undefined) search.setSort(newState.sort);
		if (newState.page !== undefined) search.setPage(newState.page);
	},
});

// Mobile filter state
const isFilterOpen = ref(false);

// Initialize on mount (client-side) only if no server data
onBeforeMount(() => {
	if (!import.meta.server && !serverData.value) {
		search.initialize();
	}
});

// Handle search input
const handleSearchInput = (value: string) => {
	search.setQuery(value);
};

// Handle sort change
const handleSortChange = (value: string) => {
	search.setSort(value);
};

// Handle page change
const handlePageChange = (page: number) => {
	search.setPage(page);
};

// Clear all filters and search
const handleClearAll = () => {
	search.clearAll();
};

// Computed pagination
const totalPages = computed(() => {
	if (!search.results.value) return 0;
	return Math.ceil(search.results.value.found / search.state.value.hitsPerPage);
});

const paginationPages = computed(() => {
	const current = search.state.value.page;
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

// Get facet results for an attribute
const getFacetResults = (attribute: string) => {
	return search.results.value?.facets[attribute] || [];
};
</script>

<template>
	<div class="search-directory-native">
		<div class="directory">
			<aside v-if="showFilters || showSort">
				<div class="form">
					<slot name="search-prepend" />

					<BaseFormGroup>
						<BaseInput
							:model-value="search.state.value.query"
							@update:model-value="handleSearchInput"
							type="search"
							:placeholder="searchPlaceholder"
							prepend-icon="search"
							autofocus
						/>
					</BaseFormGroup>

					<slot name="search-append" />

					<div class="filter-controls" v-if="showFilters && filterAttributes.length > 0">
						<BaseButton
							color="secondary"
							:label="isFilterOpen ? 'Hide Filters' : 'Show Filters'"
							outline
							class="mobile-only toggle-filter"
							icon="filter-alt"
							@click="isFilterOpen = !isFilterOpen"
						/>
						<BaseButton
							v-if="search.canClearAll.value"
							color="secondary"
							label="Clear Filters"
							outline
							icon="close"
							class="clear-filter"
							@click="handleClearAll"
						/>
						<span v-else />
					</div>

					<slot name="filters-top" />

					<div
						v-if="showFilters && filterAttributes.length > 0"
						class="facets"
						:class="{ 'mobile-hidden': !isFilterOpen }"
					>
						<TransitionGroup name="facet-fade">
							<BaseFormGroup
								v-for="filterAttr in filterAttributes"
								:key="filterAttr.attribute"
								:label="filterAttr.label"
							>
								<div
									v-if="search.loading.value && search.lastSearchTrigger.value === 'init' && !search.results.value"
									class="loading-facets"
								>
									<BaseIcon name="sync_alt" class="spin" />
									<span>Loading...</span>
								</div>
								<BaseCheckboxGroup
									v-else
									:options="
										getFacetResults(filterAttr.attribute).map((facet) => ({
											label: `${facet.value} (${facet.count})`,
											value: facet.value,
										}))
									"
									:model-value="(search.state.value.filters[filterAttr.attribute] || []) as string[]"
									@update:model-value="(values: string[]) => search.setFilter(filterAttr.attribute, values)"
								/>
							</BaseFormGroup>
						</TransitionGroup>
					</div>

					<slot name="filters-bottom" />
				</div>
			</aside>

			<main class="search-results-main">
				<!-- Initial loading state (no results yet) -->
				<div v-if="search.loading.value && !search.results.value" class="search-indicator">
					<BaseIcon name="search" class="search-icon" />
					<span>Searching...</span>
				</div>

				<div v-else-if="search.error.value" class="error-message">
					<BaseIcon name="error" />
					<span>An error occurred while searching. Please try again.</span>
				</div>

				<template v-else-if="search.results.value">
					<!-- Results header with count and search time -->
					<div v-if="search.results.value.hits.length > 0" class="results-header">
						<div class="results-info">
							<template v-if="search.loading.value">
								<span class="loading-text">Searching...</span>
							</template>
							<template v-else>
								<span class="results-count">{{ search.results.value.found.toLocaleString() }} results</span>
								<span class="search-time">({{ search.results.value.search_time_ms }}ms)</span>
							</template>
						</div>
						<div v-if="showSort && sortOptions.length > 0" class="sort-control">
							<label class="sort-label">Sort by</label>
							<BaseSelect
								:model-value="search.state.value.sort"
								:options="sortOptions"
								@update:model-value="handleSortChange"
								size="small"
							/>
						</div>
					</div>

					<div v-if="search.results.value.hits.length === 0" class="no-results">
						<slot name="empty">
							<p>No results were found. Try changing the search criteria.</p>
						</slot>
					</div>

					<div v-else class="results-container">
						<slot
							name="results"
							:items="search.results.value.hits"
							:is-search-stalled="search.loading.value"
							:search-state="search.state.value"
							:current-sort="search.state.value.sort"
						/>
					</div>

					<!-- Pagination -->
					<nav v-if="totalPages > 1" class="pagination" aria-label="Pagination">
						<ul class="pagination-list">
							<li v-if="search.state.value.page > 1" class="pagination-item">
								<a
									href="#"
									@click.prevent="handlePageChange(search.state.value.page - 1)"
									class="pagination-link pagination-link--prev"
									aria-label="Previous page"
								>
									<BaseIcon name="arrow_back" size="small" />
									<span class="pagination-label">Prev</span>
								</a>
							</li>

							<li v-for="page in paginationPages" :key="page" class="pagination-item">
								<span v-if="page === '...'" class="pagination-ellipsis">...</span>
								<a
									v-else
									href="#"
									@click.prevent="handlePageChange(Number(page))"
									class="pagination-link"
									:class="{ 'pagination-link--current': page === search.state.value.page }"
									:aria-current="page === search.state.value.page ? 'page' : undefined"
								>
									{{ page }}
								</a>
							</li>

							<li v-if="search.state.value.page < totalPages" class="pagination-item">
								<a
									href="#"
									@click.prevent="handlePageChange(search.state.value.page + 1)"
									class="pagination-link pagination-link--next"
									aria-label="Next page"
								>
									<span class="pagination-label">Next</span>
									<BaseIcon name="arrow_forward" size="small" />
								</a>
							</li>
						</ul>
					</nav>
				</template>
			</main>
		</div>
	</div>
</template>

<style lang="scss" scoped>
.search-directory-native {
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
	display: grid;
	gap: var(--space-4);
}

.filter-controls {
	display: flex;
	justify-content: space-between;
	gap: var(--space-2);
}

.facets {
	display: grid;
	gap: var(--space-4);

	@container (width <= 72rem) {
		&.mobile-hidden {
			display: none;
		}
	}
}

.loading-facets {
	display: flex;
	align-items: center;
	gap: var(--space-2);
	color: var(--gray-500);
	font-size: var(--font-size-sm);

	.spin {
		animation: spin 1s linear infinite;
	}
}

@keyframes spin {
	from {
		transform: rotate(0deg);
	}
	to {
		transform: rotate(360deg);
	}
}

.mobile-only {
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

.error-message {
	display: flex;
	align-items: center;
	gap: var(--space-2);
	color: var(--danger);
	padding: var(--space-4);
	background-color: var(--danger-50);
	border-radius: var(--rounded-md);
	margin-bottom: var(--space-4);
}

.no-results {
	text-align: center;
	color: var(--gray-600);
	font-size: var(--font-size-lg);
	margin: var(--space-16) 0;
}

.pagination {
	margin-top: var(--space-8);
}

.pagination-list {
	display: flex;
	justify-content: center;
	gap: var(--space-1);
	list-style: none;
	padding: 0;
	margin: 0;
	flex-wrap: wrap;
	max-width: 100%;

	@container (width > 40rem) {
		gap: var(--space-2);
	}
}

.pagination-item {
	display: inline-block;
}

.pagination-link {
	display: flex;
	align-items: center;
	justify-content: center;
	min-width: var(--space-10);
	height: var(--space-10);
	padding: 0 var(--space-3);
	border: 1px solid var(--gray-200);
	border-radius: var(--rounded-md);
	color: var(--gray-700);
	text-decoration: none;
	font-size: var(--font-size-sm);
	transition: all 0.2s ease;
	gap: var(--space-1);

	&--prev,
	&--next {
		padding: 0 var(--space-3);

		@container (width <= 40rem) {
			.pagination-label {
				display: inline;
			}
		}
	}

	&:hover {
		border-color: var(--primary);
		color: var(--primary);

		:deep(.base-icon) {
			--base-icon-color: var(--primary);
		}
	}

	&[aria-current='page'],
	&.pagination-link--current {
		background-color: var(--primary) !important;
		border-color: var(--primary) !important;
		color: var(--background) !important;
		font-weight: 600;

		:deep(.base-icon) {
			--base-icon-color: var(--background);
		}
	}
}

.pagination-ellipsis {
	display: flex;
	align-items: center;
	justify-content: center;
	min-width: var(--space-4);
	height: var(--space-7);
	color: var(--gray-500);
	font-size: var(--font-size-2xs);
	padding: 0 var(--space-1);

	@container (width > 40rem) {
		min-width: var(--space-10);
		height: var(--space-10);
		font-size: var(--font-size-sm);
	}
}

.facet-fade-move,
.facet-fade-enter-active,
.facet-fade-leave-active {
	transition: all 0.3s ease;
}

.facet-fade-enter-from,
.facet-fade-leave-to {
	opacity: 0;
	transform: translateX(-10px);
}

.search-results-main {
	position: relative;
	min-height: 200px;
}

// Inline loading text styles
.loading-text {
	color: var(--gray-600);
	font-size: var(--font-size-sm);
}

.results-header {
	display: flex;
	justify-content: space-between;
	align-items: end;
	padding-bottom: var(--space-4);
	margin-bottom: var(--space-6);
	border-bottom: 1px solid var(--gray-200);
	gap: var(--space-4);

	@container (width <= 40rem) {
		flex-direction: column;
		align-items: flex-start;
		gap: var(--space-3);
		margin-bottom: var(--space-4);
	}
}

.results-info {
	display: flex;
	align-items: baseline;
	gap: var(--space-2);
	color: var(--gray-600);
	font-size: var(--font-size-sm);
	flex: 1;
	min-width: 0;
}

.results-count {
	font-weight: 500;
	font-size: var(--font-size-sm);
	color: var(--gray-800);
}

.search-time {
	color: var(--gray-500);
	font-size: var(--font-size-xs);
}

.sort-control {
	display: flex;
	align-items: baseline;
	gap: var(--space-2);
	flex-shrink: 0;

	.sort-label {
		font-size: var(--font-size-sm);
		color: var(--gray-700);
		font-weight: 500;
		white-space: nowrap;
	}

	:deep(.select-wrapper) {
		min-width: 200px;
		width: 200px;
	}

	@container (width <= 40rem) {
		align-items: center;

		:deep(.select-wrapper) {
			min-width: 180px;
			width: 180px;
		}
	}
}

.results-container {
	position: relative;
}

.facets {
	min-height: 100px;
}
</style>
