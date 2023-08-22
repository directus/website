<script setup lang="ts">
import type { Query } from '@directus/sdk';
import type { Resource, Schema, Team } from '../../types/schema';
import type { BlockProps } from './types';

const { $directus, $readItem, $readItems } = useNuxtApp();

const props = defineProps<BlockProps>();

const { data: block } = useAsyncData(props.uuid, () =>
	$directus.request(
		$readItem('block_card_group_dynamic', props.uuid, {
			fields: ['stacked', 'style', 'grid', 'collection', 'filter', 'sort', 'tabs', 'limit'],
		})
	)
);

const activeTab = ref(0);
const localFilter = computed(() => unref(block)?.tabs?.at(unref(activeTab))?.filter);

const filter = computed(() => {
	const blockFilter = unref(block)?.filter;
	const additionalFilter = unref(localFilter);

	if (!blockFilter && !additionalFilter) return undefined;

	if (blockFilter && !additionalFilter) return blockFilter;
	if (!blockFilter && additionalFilter) return additionalFilter;

	return { _and: [blockFilter, additionalFilter] };
});

const { data: cards, pending } = useAsyncData(
	props.uuid + unref(block)?.collection ?? '' + unref(block)?.filter ?? '',
	async () => {
		const context = unref(block);

		if (!context) return Promise.reject();

		if (context.collection === 'team') {
			const teamItems = await $directus.request(
				$readItems('team', {
					fields: ['image', 'name', 'job_title', 'slug'],
					filter: unref(filter) as Query<Schema, Team>['filter'],
					sort: context.sort ? [context.sort as keyof Team] : undefined,
					limit: context.limit,
				})
			);

			return teamItems.map(({ image, name, job_title, slug }) => ({
				title: name,
				image,
				description: job_title,
				href: `/team/${slug}`,
			}));
		}

		const resourceItems = await $directus.request(
			$readItems('resources', {
				fields: ['image', 'title', 'slug', { author: ['name'], type: ['slug'] }],
				filter: unref(filter) as Query<Schema, Resource>['filter'],
				sort: context.sort ? [context.sort as keyof Resource] : undefined,
				limit: context.limit,
			})
		);

		return resourceItems.map(({ image, title, author, type, slug }) => ({
			title,
			image,
			description: author?.name,
			href: `/${type.slug}/${slug}`,
		}));
	},
	{ watch: [block, filter] }
);
</script>

<template>
	<div v-if="block" class="block-card-group-dynamic">
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
				:image="card.image ?? undefined"
				:media-style="block.style"
				:description="card.description ?? undefined"
				:layout="block.stacked ? 'horizontal' : 'vertical'"
				:to="card.href"
			/>
		</BaseCardGroup>
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
			color: var(--black);
			border-block-end: 1px solid var(--black);
		}

		&:hover {
			color: var(--black);
			transition: none;
		}
	}
}

.pending {
	opacity: 0.6;
	filter: saturate(0.7);
}
</style>
