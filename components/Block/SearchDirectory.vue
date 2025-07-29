<script setup lang="ts">
import type { BlockProps } from './types';

const props = defineProps<BlockProps>();

const { $directus, $readItem } = useNuxtApp();

const { data: block } = await useAsyncData(`block-search-directory-${props.uuid}`, () => {
	return $directus.request($readItem('block_search_directory', props.uuid));
});

if (!block.value) {
	throw createError({
		statusCode: 404,
		statusMessage: 'Block not found',
	});
}

const collectionConfigs = {
	extensions: {
		indexName: 'directus-extensions',
		searchConfig: {
			query_by: 'name,formatted_name,readme',
			facet_by: 'type',
			sort_by: 'recent_downloads:desc',
			per_page: 20,
			filter_by: 'total_downloads:>0 && readme:!~~',
		},
		sortOptions: [
			{ value: 'directus-extensions/sort/recent_downloads_7_days:desc', label: 'Trending - 7 Days' },
			{ value: 'directus-extensions/sort/recent_downloads_30_days:desc', label: 'Trending - 30 Days' },
			{ value: 'directus-extensions/sort/last_updated:desc', label: 'Recently Updated' },
			{ value: 'directus-extensions/sort/total_downloads:desc', label: 'Total Downloads' },
			{ value: 'directus-extensions/sort/formatted_name:asc', label: 'Name A-Z' },
			{ value: 'directus-extensions/sort/formatted_name:desc', label: 'Name Z-A' },
		],
		filterAttributes: [{ attribute: 'type', label: 'Type' }],
		defaultPlaceholder: 'Search extensions...',
	},
	integrations: {
		indexName: 'directus-integrations',
		searchConfig: {
			query_by: 'name,description',
			facet_by: 'category',
			sort_by: 'name:asc',
			per_page: 20,
			filter_by: '',
		},
		sortOptions: [
			{ value: 'directus-integrations/sort/name:asc', label: 'Name A-Z' },
			{ value: 'directus-integrations/sort/name:desc', label: 'Name Z-A' },
		],
		filterAttributes: [{ attribute: 'category', label: 'Category' }],
		defaultPlaceholder: 'Search integrations...',
	},
	templates: {
		indexName: 'directus-templates',
		searchConfig: {
			query_by: 'name,description,content,framework',
			facet_by: 'use_cases,framework,payment_type,template_status,directus_plus,has_frontend,cloud_template',
			sort_by: 'created_at:desc',
			per_page: 24,
			filter_by: 'status:published',
		},
		sortOptions: [
			{ value: 'directus-templates/sort/created_at:desc', label: 'Newest First' },
			{ value: 'directus-templates/sort/created_at:asc', label: 'Oldest First' },
			{ value: 'directus-templates/sort/name:asc', label: 'Name A-Z' },
			{ value: 'directus-templates/sort/name:desc', label: 'Name Z-A' },
		],
		filterAttributes: [
			{ attribute: 'framework', label: 'Framework' },
			{ attribute: 'use_cases', label: 'Use Cases', showMore: true },
		],
		defaultPlaceholder: 'Search templates...',
	},
};

const collection = computed(() => block.value?.collection);
const config = computed(() => collectionConfigs[collection.value as keyof typeof collectionConfigs]);
const hitsPerPage = computed(() => block.value?.hits_per_page || config.value.searchConfig.per_page);
</script>

<template>
	<BaseSearchDirectory
		:index-name="config.indexName"
		:search-config="config.searchConfig"
		:search-placeholder="`Search ${collection}`"
		:sort-options="config.sortOptions"
		:filter-attributes="config.filterAttributes"
		:hits-per-page="hitsPerPage"
		:show-filters="true"
		:show-sort="true"
	>
		<template #results="{ items, currentSort }">
			<!-- Extensions Layout -->
			<BaseCardGroup v-if="collection === 'extensions'" grid="2">
				<MarketplaceExtensionCard
					v-for="item in items"
					:key="item.objectID || item.id"
					:extension="item"
					:to="`/extensions/${item.name}`"
					:current-sort="currentSort"
				/>
			</BaseCardGroup>

			<!-- Integrations Layout -->
			<div v-else-if="collection === 'integrations'" class="integrations-grid">
				<BaseCard
					v-for="item in items"
					:key="item.objectID || item.slug"
					:title="item.name"
					:image="item.logo ?? undefined"
					:description="item.description ?? undefined"
					:to="`/integrations/${item.slug}`"
					:badge="item.category ?? undefined"
					media-style="image-fill-16-9"
				/>
			</div>

			<!-- Templates Layout -->
			<div v-else-if="collection === 'templates'" class="templates-grid">
				<BaseCard
					v-for="item in items"
					:key="item.slug"
					:title="item.name"
					:image="item.image ?? undefined"
					:description="item.description ?? undefined"
					:to="`/templates/${item.slug}`"
					:badge="item.framework || item.use_cases?.[0] || 'Template'"
					media-style="image-fill-16-9"
				/>
			</div>
		</template>

		<template #empty>
			<p class="no-results">No {{ block?.collection }} were found. Try changing the search criteria.</p>
		</template>
	</BaseSearchDirectory>
</template>

<style lang="scss" scoped>
.integrations-grid {
	display: grid;
	gap: var(--space-6);
	grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));

	@container (width > 60rem) {
		grid-template-columns: repeat(3, 1fr);
	}
}

.templates-grid {
	display: grid;
	gap: var(--space-6);
	grid-template-columns: repeat(auto-fill, minmax(20rem, 1fr));

	@container (width > 60rem) {
		grid-template-columns: repeat(3, 1fr);
	}
}

.no-results {
	text-align: center;
	color: var(--gray-600);
	font-size: var(--font-size-lg);
	margin: var(--space-16) 0;
}
</style>
