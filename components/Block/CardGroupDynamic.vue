<script setup lang="ts">
import type { Query } from '@directus/sdk';
import type { Resource, Schema, Team } from '../../types/schema';
import type { BlockProps } from './types';

const { $directus, $readItem, $readItems } = useNuxtApp();

const props = defineProps<BlockProps>();

const { data } = useAsyncData(props.uuid, async () => {
	const block = await $directus.request(
		$readItem('block_card_group_dynamic', props.uuid, {
			fields: ['stacked', 'style', 'grid', 'collection', 'filter', 'sort'],
		})
	);

	const fetchCards = async (context: typeof block) => {
		if (!context) return Promise.reject();

		if (context.collection === 'team') {
			const teamItems = await $directus.request(
				$readItems('team', {
					fields: ['image', 'name', 'job_title'],
					filter: context.filter as Query<Schema, Team>['filter'],
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
				filter: context.filter as Query<Schema, Resource>['filter'],
				sort: context.sort ? [context.sort as keyof Resource] : undefined,
			})
		);

		return resourceItems.map(({ image, title, author }) => ({
			title,
			image,
			description: author?.name,
		}));
	};

	const cards = await fetchCards(block);

	return { cards, block };
});
</script>

<template>
	<BaseCardGroup v-if="data" :direction="data.block.stacked ? 'vertical' : 'horizontal'" :grid="data.block.grid">
		<BaseCard
			v-for="card in data.cards"
			:key="card.title"
			:title="card.title"
			:image="card.image ?? undefined"
			:media-style="data.block.style"
			:description="card.description ?? undefined"
			:layout="data.block.stacked ? 'horizontal' : 'vertical'"
		/>
	</BaseCardGroup>
</template>
