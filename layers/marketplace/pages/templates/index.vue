<script setup lang="ts">
useHead({
	title: 'Templates - Directus Marketplace',
});

useServerSeoMeta({
	title: 'Templates - Directus Marketplace',
	description:
		'Jump-start your next project with professionally crafted Directus templates. Find templates for CMS, eCommerce, agencies, and more.',
	ogTitle: 'Templates - Directus Marketplace',
	ogDescription:
		'Jump-start your next project with professionally crafted Directus templates. Find templates for CMS, eCommerce, agencies, and more.',
});

const searchConfig = {
	query_by: 'name,description,content,framework',
	facet_by: 'use_cases,framework,payment_type,template_status,directus_plus,has_frontend,cloud_template',
	sort_by: 'created_at:desc',
	per_page: 24,
	filter_by: 'status:published',
};

const sortOptions = [
	{ value: 'directus-templates/sort/created_at:desc', label: 'Newest First' },
	{ value: 'directus-templates/sort/created_at:asc', label: 'Oldest First' },
	{ value: 'directus-templates/sort/name:asc', label: 'Name A-Z' },
	{ value: 'directus-templates/sort/name:desc', label: 'Name Z-A' },
];

const filterAttributes = [
	{ attribute: 'framework', label: 'Framework' },
	{ attribute: 'use_cases', label: 'Use Cases', showMore: true },
];

definePageMeta({
	layout: 'marketplace',
});
</script>

<template>
	<PageSection background="pristine-white-lines" spacing="small">
		<BaseContainer spacing="small">
			<BaseBlock type="block_columns" uuid="d8f87c47-8720-4867-991b-060062d67b42" />
		</BaseContainer>
		<BaseContainer spacing="medium">
			<BaseSearchDirectory
				index-name="directus-templates"
				:search-config="searchConfig"
				search-placeholder="Search templates..."
				:sort-options="sortOptions"
				:filter-attributes="filterAttributes"
				:hits-per-page="24"
			>
				<template #results="{ items }">
					<div class="templates-grid">
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
					<p class="no-results">No templates were found. Try changing the search criteria.</p>
				</template>
			</BaseSearchDirectory>
		</BaseContainer>
	</PageSection>
</template>

<style lang="scss" scoped>
.templates-grid {
	display: grid;
	gap: var(--space-6);
	grid-template-columns: repeat(auto-fill, minmax(20rem, 1fr));

	@container (width > 60rem) {
		grid-template-columns: repeat(3, 1fr);
	}
}

.template-meta {
	display: flex;
	gap: var(--space-3);
	align-items: center;
	font-size: var(--font-size-xs);
	color: var(--gray-600);

	.payment-type,
	.cloud-badge,
	.plus-badge {
		display: flex;
		align-items: center;
		gap: var(--space-1);

		svg {
			width: var(--space-3);
			height: var(--space-3);
		}
	}

	.payment-type {
		&:has([name='paid']) {
			color: var(--orange-600);
		}

		&:has([name='currency_exchange_off']) {
			color: var(--green-600);
		}
	}

	.cloud-badge {
		color: var(--blue-600);
	}

	.plus-badge {
		color: var(--purple-600);
	}
}

.no-results {
	text-align: center;
	color: var(--gray-600);
	font-size: var(--font-size-lg);
	margin: var(--space-16) 0;
}
</style>
