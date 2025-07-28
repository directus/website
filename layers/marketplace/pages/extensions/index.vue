<script setup lang="ts">
useHead({
	title: 'Extensions - Directus Marketplace',
});

useServerSeoMeta({
	title: 'Extensions - Directus Marketplace',
	description:
		'Give your Directus instance superpowers. Discover extensions for endpoints, operations, interfaces, bundles, and more.',
	ogTitle: 'Extensions - Directus Marketplace',
	ogDescription:
		'Give your Directus instance superpowers. Discover extensions for endpoints, operations, interfaces, bundles, and more.',
});

const searchConfig = {
	query_by: 'name,formatted_name,readme',
	facet_by: 'type',
	sort_by: 'recent_downloads:desc',
	per_page: 20,
	filter_by: 'total_downloads:>0 && readme:!~~',
};

const sortByItems = [
	{ value: 'directus-extensions/sort/recent_downloads:desc', label: 'Trending' },
	{ value: 'directus-extensions/sort/total_downloads:desc', label: 'Total Downloads' },
	{ value: 'directus-extensions/sort/formatted_name:asc', label: 'Name A-Z' },
	{ value: 'directus-extensions/sort/formatted_name:desc', label: 'Name Z-A' },
	{ value: 'directus-extensions/sort/last_updated:desc', label: 'Recently Updated' },
];

const filterAttributes = [{ attribute: 'type', label: 'Type' }];

definePageMeta({
	layout: 'marketplace',
});
</script>

<template>
	<div>
		<PageSection background="pristine-white-lines" spacing="small">
			<BaseContainer spacing="small">
				<BaseBlock type="block_columns" uuid="2dffb738-6ec1-46ce-bad8-715ed7bef424" />
			</BaseContainer>
			<BaseContainer spacing="medium">
				<BaseSearchDirectory
					index-name="directus-extensions"
					:search-config="searchConfig"
					search-placeholder="Search extensions..."
					:sort-options="sortByItems"
					:filter-attributes="filterAttributes"
					:hits-per-page="20"
				>
					<template #results="{ items }">
						<BaseCardGroup grid="2">
							<MarketplaceExtensionCard
								v-for="item in items"
								:key="item.objectID || item.id"
								:extension="item"
								:to="`/extensions/${item.name}`"
							/>
						</BaseCardGroup>
					</template>
					<template #empty>
						<p class="no-results">No extensions were found. Try changing the search criteria.</p>
					</template>
				</BaseSearchDirectory>
			</BaseContainer>
		</PageSection>
	</div>
</template>

<style lang="scss" scoped>
.no-results {
	text-align: center;
	color: var(--gray-600);
	font-size: var(--font-size-lg);
	margin: var(--space-16) 0;
}
</style>
