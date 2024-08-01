<script setup lang="ts">
import type { BlockProps } from './types';
import type { AgencyPartner, Project } from '~/types/schema';

const { $directus, $readItem, $readItems } = useNuxtApp();

const props = defineProps<BlockProps>();

const { data: block } = await useAsyncData(props.uuid, () =>
	$directus.request(
		$readItem('block_directory', props.uuid, {
			fields: ['style', 'grid', 'collection', 'filter', 'title_size'],
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
	}
});

// Search Capability
const { searchQuery, selectedFacets, facets, filteredItems, clearFilters } = useDirectory({
	items: cards.value ?? [],
	searchFields: unref(dirConfig)?.searchFields ?? [],
	facetFields: unref(dirConfig)?.facetFields ?? [],
	fieldMapping: unref(dirConfig)?.fieldMapping ?? undefined,
});
</script>

<template>
	<div v-if="block" :id="`block-${uuid}`" class="block-card-group-dynamic">
		<div class="directory">
			<aside>
				<div class="form">
					<BaseFormGroup>
						<BaseInput v-model="searchQuery" type="search" class="input" placeholder="Search" prepend-icon="search" />
					</BaseFormGroup>
					<template v-if="facets">
						<BaseFormGroup v-for="facet in facets" :key="facet.field" :label="toTitleCase(facet.field)">
							<BaseCheckboxGroup
								v-model="selectedFacets[facet.field]"
								:options="facet.options.map((opt: any) => ({ label: `${opt.value} (${opt.count})`, value: opt.value }))"
							/>
						</BaseFormGroup>
					</template>
					<BaseButton color="secondary" label="Clear Filters" outline @click="clearFilters()" />
				</div>
			</aside>
			<main>
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

				<p v-if="filteredItems?.length === 0">No items were found. Try changing the search criteria.</p>
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

	> * + * {
		margin-block-start: var(--space-4);
	}
}

.block-card-group-dynamic {
	position: relative;
}

.pending {
	opacity: 0.6;
	filter: saturate(0.7);
}
</style>
