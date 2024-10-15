<script setup lang="ts">
import { formatTitle } from '@directus/format-title';
import type { BlockProps } from './types';
import type { AgencyPartner, Project } from '~/types/schema';

const { $directus, $readItem, $readItems } = useNuxtApp();

const props = defineProps<BlockProps>();

const { data: block } = await useAsyncData(props.uuid, () =>
	$directus.request(
		$readItem('block_directory', props.uuid, {
			fields: ['style', 'grid', 'collection', 'filter', 'title_size', 'group_by'],
		}),
	),
);

const limit = -1;

const filter = computed(() => {
	const blockFilter = unref(block)?.filter;

	if (!blockFilter) return undefined;

	return { _and: [blockFilter] };
});

const { data: cards } = await useAsyncData(
	'cards-' + props.uuid + (unref(block)?.collection ?? '') + (unref(block)?.filter ?? ''),
	async () => {
		const context = unref(block);

		if (!context) return Promise.reject();

		const items = await $directus.request(
			$readItems(context.collection, {
				fields: ['*'],
				filter: unref(filter) as any,
				limit: limit,
			}),
		);

		return items;
	},
	{ watch: [block, filter] },
);

// Directory Configuration
const dirConfig = computed(() => {
	const context = unref(block);

	if (!context) return {};

	if (context.collection === 'agency_partners') {
		return {
			searchFields: ['partner_name', 'region', 'country'],
			facetFields: ['region', 'tier'],
			fieldMapping: {
				title: 'partner_name',
				image: 'partner_logo',
				description: (item: AgencyPartner) => (item.region ? item.region.join(', ') : ''),
				href: (item: AgencyPartner) => `/agency-directory/${item.slug}`,
			},
		};
	} else if (context.collection === 'projects') {
		return {
			searchFields: ['project_title', 'client'],
			facetFields: ['use_cases'],
			fieldMapping: {
				title: 'project_title',
				image: 'featured_image',
				description: (item: Project) => truncateString(item.short_summary, 100),
				href: (item: Project) => `/built-with-directus/${item.slug}`,
			},
		};
	} else if (context.collection === 'features') {
		return {
			searchFields: ['title', 'description'],
			facetFields: ['module'],
			fieldMapping: {
				title: 'title',
				image: 'thumbnail',
				description: 'description',
				href: (item: any) => `/features/${item.slug}`,
				module: 'module',
			},
			groupBy: 'module',
		};
	} else if (context.collection === 'templates') {
		return {
			searchFields: ['name', 'description'],
			facetFields: ['framework', 'use_cases'],
			fieldMapping: {
				title: 'name',
				image: 'image',
				description: 'description',
				href: (item: any) => `/templates/${item.slug}`,
			},
		};
	}
});

// Search Capability
const { searchQuery, selectedFacets, facets, filteredItems, isFilterActive, clearFilters } = useDirectory({
	items: cards.value ?? [],
	searchFields: unref(dirConfig)?.searchFields ?? [],
	facetFields: unref(dirConfig)?.facetFields ?? [],
	fieldMapping: unref(dirConfig)?.fieldMapping ?? undefined,
	groupBy: unref(dirConfig)?.groupBy ?? undefined,
});

// Mobile filter state
const isFilterOpen = ref(false);

const toggleFilter = () => {
	isFilterOpen.value = !isFilterOpen.value;
};
</script>

<template>
	<div v-if="block" :id="`block-${uuid}`" class="block-card-group-dynamic">
		<div class="directory">
			<aside>
				<div class="form">
					<BaseFormGroup>
						<BaseInput v-model="searchQuery" type="search" class="input" placeholder="Search" prepend-icon="search" />
					</BaseFormGroup>
					<div class="filter-controls">
						<BaseButton
							color="secondary"
							:label="isFilterOpen ? 'Hide Filters' : 'Show Filters'"
							outline
							class="mobile-only toggle-filter"
							icon="filter-alt"
							@click="toggleFilter()"
						/>
						<BaseButton
							v-if="isFilterActive"
							color="secondary"
							label="Clear Filters"
							outline
							icon="close"
							class="clear-filter"
							@click="clearFilters()"
						/>
					</div>
					<div v-if="facets" class="facets" :class="{ 'mobile-hidden': !isFilterOpen }">
						<BaseFormGroup v-for="facet in facets" :key="facet.field" :label="formatTitle(facet.field)">
							<BaseCheckboxGroup
								v-model="selectedFacets[facet.field]"
								:options="facet.options.map((opt: any) => ({ label: `${opt.value} (${opt.count})`, value: opt.value }))"
							/>
						</BaseFormGroup>
					</div>
				</div>
			</aside>
			<main>
				<template v-if="Array.isArray(filteredItems)">
					<BaseCardGroup v-auto-animate :grid="block.grid">
						<BaseCard
							v-for="card in filteredItems"
							:key="card.title"
							:title="card.title"
							:image="card.image ?? undefined"
							:media-style="block.style"
							:description="card.description ?? undefined"
							:description-avatar="card.avatar ?? undefined"
							layout="vertical"
							:to="card.href"
							:badge="card.badge ?? undefined"
							:title-size="block.title_size"
						/>
					</BaseCardGroup>
				</template>
				<template v-else>
					<div v-for="(group, groupName) in filteredItems" :key="groupName" class="group-container">
						<h2 v-if="groupName" class="group-title">{{ formatTitle(groupName as string) }}</h2>
						<BaseCardGroup v-auto-animate :grid="block.grid">
							<BaseCard
								v-for="card in group"
								:key="card.title"
								:title="card.title"
								:image="card.image ?? undefined"
								:media-style="block.style"
								:description="card.description ?? undefined"
								:description-avatar="card.avatar ?? undefined"
								layout="vertical"
								:to="card.href"
								:badge="card.badge ?? undefined"
								:title-size="block.title_size"
							/>
						</BaseCardGroup>
					</div>
				</template>

				<p
					v-if="
						(Array.isArray(filteredItems) && filteredItems.length === 0) ||
						(!Array.isArray(filteredItems) && Object.keys(filteredItems).length === 0)
					"
				>
					No items were found. Try changing the search criteria.
				</p>
				<!-- @TODO: Pagination -->
			</main>
		</div>
	</div>
</template>

<style lang="scss" scoped>
.directory {
	display: grid;
	grid-template-columns: 1fr;
	gap: var(--space-10);

	@container (width > 40rem) {
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
		'controls'
		'facets';
	gap: var(--space-4);

	@container (width > 40rem) {
		grid-template-areas:
			'search'
			'facets'
			'controls';
	}

	.input {
		grid-area: search;
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

		@container (width <= 40rem) {
			&.mobile-hidden {
				display: none;
			}
		}
	}
}

.block-card-group-dynamic {
	position: relative;
}

.pending {
	opacity: 0.6;
	filter: saturate(0.7);
}

.mobile-only {
	@container (width > 40rem) {
		display: none;
	}
}

.toggle-filter {
	@container (width > 40rem) {
		display: none;
	}
}

.clear-filter {
	@container (width <= 40rem) {
		justify-self: end;
	}
}

.group-container {
	margin-bottom: var(--space-8);
}

.group-title {
	font-size: var(--text-lg);
	font-weight: var(--weight-bold);
	margin-bottom: var(--space-4);
	border-bottom: 1px solid var(--gray-200);
}
</style>
