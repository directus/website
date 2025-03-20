<script setup lang="ts">
import type { Query } from '@directus/sdk';
import type { Event, Resource, Schema, Team } from '../../types/schema';
import type { BlockProps } from './types';

const props = defineProps<BlockProps>();
const route = useRoute();
const router = useRouter();

const { $directus, $readItem, $readItems, $aggregate } = useNuxtApp();

const { data: block } = await useAsyncData(props.uuid, () =>
	$directus.request(
		$readItem('block_card_group_dynamic', props.uuid, {
			fields: [
				'stacked',
				'style',
				'grid',
				'collection',
				'filter',
				'sort',
				'sort_direction',
				'tabs',
				'limit',
				'title_size',
			],
		}),
	));

const activeTab = ref(0);
const localFilter = computed(() => unref(block)?.tabs?.at(unref(activeTab))?.filter);
const page = ref(route.query?.page ? Number(route.query?.page) : 1);

watch(activeTab, () => (page.value = 1));

watch(page, (newVal, oldVal) => {
	if (newVal !== oldVal) {
		document.getElementById(`block-${props.uuid}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
		router.replace({ query: { ...route.query, page: newVal } });
	}
});

const filter = computed(() => {
	const blockFilter = unref(block)?.filter;
	const additionalFilter = unref(localFilter);

	if (!blockFilter && !additionalFilter) return;

	if (blockFilter && !additionalFilter) return blockFilter;
	if (!blockFilter && additionalFilter) return additionalFilter;

	return { _and: [blockFilter, additionalFilter] };
});

const { data: cards, pending } = await useAsyncData(
	`cards-${props.uuid}${unref(block)?.collection ?? ''}${unref(block)?.filter ?? ''}`,
	async () => {
		const context = unref(block);

		if (!context) throw undefined;

		switch (context.collection) {
			case 'team': {
				const teamItems = await $directus.request(
					$readItems('team', {
						fields: ['image', 'name', 'job_title', 'slug', 'resources', 'type'],
						filter: unref(filter) as Query<Schema, Team>['filter'],
						sort: context.sort
							? [((context.sort_direction === 'desc' ? '-' : '') + context.sort) as keyof Team]
							: undefined,
						limit: context.limit,
						page: unref(page),
					}),
				);

				return teamItems.map(({ image, name, job_title, slug, type, resources }) => ({
					title: name,
					image,
					avatar: null,
					description: job_title,
					// Don't create a link for non-core team members or guest authors without resources
					href: type === 'core_team' || (resources && resources.length > 0) ? `/team/${slug}` : undefined,
					badge: null,
				}));
			}
			case 'resources': {
				const resourceItems = await $directus.request(
					$readItems('resources', {
						fields: [
							'image',
							'title',
							'slug',
							'category',
							'date_published',
							{ author: ['image', 'name'], type: ['slug'] },
						],
						filter: unref(filter) as Query<Schema, Resource>['filter'],
						sort: context.sort
							? [((context.sort_direction === 'desc' ? '-' : '') + context.sort) as keyof Resource]
							: undefined,
						limit: context.limit,
						page: unref(page),
					}),
				);

				return resourceItems.map(({ image, title, author, type, slug, category, date_published }) => {
					return {
						title,
						image,
						avatar: author?.image,
						description: date_published
							? new Intl.DateTimeFormat('en-US', { dateStyle: 'medium' }).format(new Date(date_published))
							: '',
						href: `/${type.slug}/${slug}`,
						badge: category,
					};
				});
			}
			case 'events': {
				const eventItems = await $directus.request(
					$readItems('events', {
						fields: ['name', 'start_time', 'location', 'link_url', 'link_text', 'description', 'cover'],
						filter: unref(filter) as Query<Schema, Event>['filter'],
						sort: context.sort
							? [((context.sort_direction === 'desc' ? '-' : '') + context.sort) as keyof Event]
							: undefined,
						limit: context.limit,
						page: unref(page),
					}),
				);

				return eventItems.map(({ name, start_time, location, link_url, cover }) => {
					return {
						title: name,
						image: cover,
						avatar: null,
						description: start_time
							? new Intl.DateTimeFormat('en-US', {
									dateStyle: 'medium',
								}).format(new Date(start_time))
							: '',
						href: link_url ?? undefined,
						badge: location?.includes('Online') ? 'Online' : 'In Person',
					};
				});
			}
		// No default
		}
	},
	{ watch: [block, filter, page] },
);

const { data: count } = await useAsyncData(
	`count-${props.uuid}${unref(block)?.collection ?? ''}${unref(block)?.filter ?? ''}`,
	() => {
		const context = unref(block);

		if (!context) return Promise.reject();

		return $directus.request(
			$aggregate(context.collection, {
				query: {
					filter: unref(filter) as Query<Schema, unknown>['filter'],
				},
				aggregate: {
					count: 'id',
				},
			}),
		);
	},
	{
		transform: (data: any) => (data?.[0]?.count?.id ? Number(data[0].count.id) : null),
		watch: [block, filter],
	},
);
</script>

<template>
	<div v-if="block" :id="`block-${uuid}`" class="block-card-group-dynamic">
		<div v-if="block?.tabs" class="tabs">
			<button
				v-for="(tab, index) in block.tabs"
				:key="tab.name"
				:class="{ active: activeTab === index }"
				@click="activeTab = index"
			>
				{{ tab.name }}
			</button>
		</div>

		<BaseCardGroup :class="{ pending }" :direction="block.stacked ? 'vertical' : 'horizontal'" :grid="block.grid">
			<BaseCard
				v-for="card in cards"
				:key="card.title"
				:title="card.title"
				:image="(card.image as string) ?? undefined"
				:media-style="block.style"
				:description="card.description ?? undefined"
				:description-avatar="(card.avatar as string) ?? undefined"
				:layout="block.stacked ? 'horizontal' : 'vertical'"
				:to="card.href"
				:badge="card.badge ?? undefined"
				:title-size="block.title_size"
			/>
		</BaseCardGroup>

		<p v-if="cards?.length === 0">
			No items were found. Try changing the search criteria.
		</p>

		<BasePagination
			v-if="count !== null && count > block.limit"
			v-model="page"
			:disabled="pending"
			:class="{ pending }"
			class="pagination"
			:total="count"
			:per-page="block.limit"
		/>
	</div>
</template>

<style lang="scss" scoped>
.block-card-group-dynamic {
	position: relative;
}

.tabs {
	margin-block-end: var(--space-5);
	display: flex;
	flex-wrap: wrap;
	gap: var(--space-2) var(--space-8);

	@container (width > 50rem) {
		text-align: end;
		position: absolute;
		inset-inline-end: 0;
		inset-block-start: calc(-1 * var(--space-10));
		translate: 0 -100%;
	}

	button {
		color: var(--gray-400);
		display: inline-block;
		font-size: var(--font-size-base);
		line-height: var(--line-height-base);
		cursor: pointer;
		transition: color var(--duration-150) var(--ease-out);

		&.active {
			color: var(--foreground);
			border-block-end: 1px solid var(--foreground);
		}

		&:hover {
			color: var(--foreground);
			transition: none;
		}
	}
}

.pending {
	opacity: 0.6;
	filter: saturate(0.7);
}

.pagination {
	margin-inline: auto;
	max-inline-size: max-content;
	margin-block-start: var(--space-10);
}
</style>
