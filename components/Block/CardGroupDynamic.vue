<script setup lang="ts">
import type { Query } from '@directus/sdk';
import type { Resource, Schema, Team } from '../../types/schema';
import type { BlockProps } from './types';

const { $directus, $readItem, $readItems } = useNuxtApp();

const props = defineProps<BlockProps>();

const { data: block } = useAsyncData(props.uuid, () =>
	$directus.request(
		$readItem('block_card_group_dynamic', props.uuid, {
			fields: ['stacked', 'style', 'grid', 'collection', 'filter', 'sort', 'tabs'],
		})
	)
);

const localFilter = ref<Record<string, unknown>>();

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
					fields: ['image', 'name', 'job_title'],
					filter: unref(filter) as Query<Schema, Team>['filter'],
					sort: context.sort ? [context.sort as keyof Team] : undefined,
				})
			);

			return teamItems.map(({ image, name, job_title }) => ({
				title: name,
				image,
				description: job_title,
			}));
		}

		const resourceItems = await $directus.request(
			$readItems('resources', {
				fields: ['image', 'title', { author: ['name'] }],
				filter: unref(filter) as Query<Schema, Resource>['filter'],
				sort: context.sort ? [context.sort as keyof Resource] : undefined,
			})
		);

		return resourceItems.map(({ image, title, author }) => ({
			title,
			image,
			description: author?.name,
		}));
	},
	{ watch: [block, filter] }
);
</script>

<template>
	<div class="block-card-group-dynamic">
		<div v-if="block?.tabs" class="tabs">
			<button
				v-for="tab in block.tabs"
				:key="tab.name"
				:class="{ active: localFilter === tab.filter }"
				@click="localFilter = tab.filter"
			>
				{{ tab.name }}
			</button>
		</div>

		<p v-if="pending">Loading</p>
		<BaseCardGroup v-else-if="block" :direction="block.stacked ? 'vertical' : 'horizontal'" :grid="block.grid">
			<BaseCard
				v-for="card in cards"
				:key="card.title"
				:title="card.title"
				:image="card.image ?? undefined"
				:media-style="block.style"
				:description="card.description ?? undefined"
				:layout="block.stacked ? 'horizontal' : 'vertical'"
			/>
		</BaseCardGroup>
	</div>
</template>
