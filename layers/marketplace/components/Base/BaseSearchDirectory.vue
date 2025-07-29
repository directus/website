<script setup lang="ts">
import { useTypesenseSearch } from '~/layers/marketplace/composables/useTypesenseSearch';
import { useSearchURLState } from '~/layers/marketplace/composables/useSearchURLState';
import { parseSearchURLState } from '~/layers/marketplace/utils/parse-search-url-state';
import { getTypesenseService } from '~/layers/marketplace/services/typesenseService';
import type { SearchConfig, SortOption, FilterAttribute } from '~/layers/marketplace/composables/useTypesenseSearch';

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

const route = useRoute();

function getInitialState() {
	return parseSearchURLState({
		query: route.query,
		filterAttributes: props.filterAttributes,
		hitsPerPage: props.hitsPerPage,
		includeEmptyDefaults: false,
	});
}

// Fetch data once on the server to initalize the client state

const { data: serverData } = await useAsyncData(props.cacheKey || `search-${props.indexName}`, async () => {

	if (!import.meta.server) {
			return null;
	}

	const typesenseService = getTypesenseService();
	const initialState = getInitialState();


	const searchState = {
		query: initialState.query || '',
		filters: initialState.filters || {},
		sort: initialState.sort || props.sortOptions[0]?.value || props.searchConfig.sort_by || '',
		page: initialState.page || 1,
		hitsPerPage: initialState.hitsPerPage || props.searchConfig.per_page || props.hitsPerPage,
	};


	const result = await typesenseService.search({
		indexName: props.indexName,
		searchConfig: props.searchConfig,
		state: searchState,
		filterAttributes: props.filterAttributes,
	});


	return result;
});


// Get the initial state that should be used (URL params take precedence)
const clientInitialState = getInitialState();

// Check if URL params exist and differ from what server rendered
const hasURLParams = Object.keys(route.query).length > 0;

// Define what the server state would have been (defaults used during prerendering)
const expectedServerState = {
	query: '',
	filters: {},
	sort: props.sortOptions[0]?.value || props.searchConfig.sort_by || '',
	page: 1,
};

// Check if URL state actually differs from server state
const urlDiffersFromServer =
	hasURLParams &&
	serverData.value &&
	(clientInitialState.query !== expectedServerState.query ||
		JSON.stringify(clientInitialState.filters) !== JSON.stringify(expectedServerState.filters) ||
		clientInitialState.page !== expectedServerState.page ||
		(clientInitialState.sort && clientInitialState.sort !== expectedServerState.sort));


// If we have URL params, ensure the search composable starts with the correct state
const finalInitialState = hasURLParams
	? clientInitialState
	: {
			query: '',
			filters: {},
			sort: props.sortOptions[0]?.value || props.searchConfig.sort_by || '',
			page: 1,
			hitsPerPage: props.hitsPerPage,
		};


const search = useTypesenseSearch({
	indexName: props.indexName,
	searchConfig: props.searchConfig,
	sortOptions: props.sortOptions,
	filterAttributes: props.filterAttributes,
	initialState: finalInitialState,
	initialData: urlDiffersFromServer ? null : serverData.value, // Don't use server data if URL differs
});


useSearchURLState({
	state: search.state,
	indexName: props.indexName,
	sortOptions: props.sortOptions,
	filterAttributes: props.filterAttributes,
	onStateChange: (newState) => {

		// Apply state changes atomically to avoid multiple search triggers
		const stateUpdates: (() => void)[] = [];

		if (newState.query !== undefined && newState.query !== search.state.value.query) {
			stateUpdates.push(() => search.setQuery(newState.query!));
		}

		if (
			newState.filters !== undefined &&
			JSON.stringify(newState.filters) !== JSON.stringify(search.state.value.filters)
		) {
			stateUpdates.push(() => search.setFilters(newState.filters!));
		}

		if (newState.sort !== undefined && newState.sort !== search.state.value.sort) {
			stateUpdates.push(() => search.setSort(newState.sort!));
		}

		if (newState.page !== undefined && newState.page !== search.state.value.page) {
			stateUpdates.push(() => search.setPage(newState.page!));
		}

		// Apply all updates
		stateUpdates.forEach((update) => update());
	},
});

const isFilterOpen = ref(false);

onBeforeMount(() => {

	// Initialize search if:
	// 1. No server data exists (normal client-side initialization)
	// 2. URL params differ from server state (need to fetch new data)
	if (!import.meta.server && (!serverData.value || urlDiffersFromServer)) {

		search.initialize();
	}
});

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
							@update:model-value="search.setQuery"
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
							@click="search.clearAll"
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
										search.getFacetResults(filterAttr.attribute).map((facet) => ({
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
								@update:model-value="search.setSort"
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
					<nav v-if="search.totalPages.value > 1" class="pagination" aria-label="Pagination">
						<ul class="pagination-list">
							<li v-if="search.hasPreviousPage" class="pagination-item">
								<a
									href="#"
									@click.prevent="search.goToPreviousPage"
									class="pagination-link pagination-link--prev"
									aria-label="Previous page"
								>
									<BaseIcon name="arrow_back" size="small" />
									<span class="pagination-label">Prev</span>
								</a>
							</li>

							<li v-for="page in search.paginationPages.value" :key="page" class="pagination-item">
								<span v-if="page === '...'" class="pagination-ellipsis">...</span>
								<a
									v-else
									href="#"
									@click.prevent="search.setPage(Number(page))"
									class="pagination-link"
									:class="{ 'pagination-link--current': page === search.state.value.page }"
									:aria-current="page === search.state.value.page ? 'page' : undefined"
								>
									{{ page }}
								</a>
							</li>

							<li v-if="search.hasNextPage" class="pagination-item">
								<a
									href="#"
									@click.prevent="search.goToNextPage"
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

.search-results-main {
	min-height: 600px;
}
</style>
