<script setup lang="ts">
useHead({
	title: 'Integrations - Directus Marketplace',
});

useServerSeoMeta({
	title: 'Integrations - Directus Marketplace',
	description:
		'Connect your Directus instance to powerful third-party services. Discover integrations for AI, analytics, CRM, and more.',
	ogTitle: 'Integrations - Directus Marketplace',
	ogDescription:
		'Connect your Directus instance to powerful third-party services. Discover integrations for AI, analytics, CRM, and more.',
});

const searchConfig = {
	query_by: 'name,description',
	facet_by: 'category',
	sort_by: 'name:asc',
	per_page: 20,
	filter_by: '',
};

const sortByItems = [
	{ value: 'directus-integrations/sort/name:asc', label: 'Name A-Z' },
	{ value: 'directus-integrations/sort/name:desc', label: 'Name Z-A' },
];

const filterAttributes = [{ attribute: 'category', label: 'Category' }];

definePageMeta({
	layout: 'marketplace',
});
</script>

<template>
	<PageSection background="pristine-white-lines" spacing="small">
		<BaseContainer spacing="small">
			<BaseBlock type="block_columns" uuid="c88ad885-3e73-4d78-9586-2fbcdd9cd918" />
		</BaseContainer>
		<BaseContainer spacing="medium">
			<BaseSearchDirectory
				index-name="directus-integrations"
				:search-config="searchConfig"
				search-placeholder="Search integrations..."
				:sort-options="sortByItems"
				:filter-attributes="filterAttributes"
				:hits-per-page="20"
			>
				<template #results="{ items }">
					<div class="integrations-grid">
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
				</template>

				<template #empty>
					<p class="no-results">No integrations were found. Try changing the search criteria.</p>
				</template>
			</BaseSearchDirectory>
		</BaseContainer>
	</PageSection>
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

.no-results {
	text-align: center;
	color: var(--gray-600);
	font-size: var(--font-size-lg);
	margin: var(--space-16) 0;
}
</style>
