<script setup lang="ts">
import type { BlockProps } from './types';

const { $directus, $readItem } = useNuxtApp();

const props = defineProps<BlockProps>();

const { data: block } = useAsyncData(props.uuid, () =>
	$directus.request(
		$readItem('block_cardgroup', props.uuid, {
			fields: [
				'direction',
				'aspect_ratio',
				{
					cards: [
						'id',
						'title',
						'description',
						'external_url',
						'image',
						{ page: ['permalink'], resource: ['type', 'slug'] },
					],
				},
			],
		})
	)
);
</script>

<template>
	<div v-if="block" :class="[`direction-${block.direction}`, 'block-cardgroup']">
		<BaseCard
			v-for="card in block.cards"
			:key="card.id"
			:title="card.title ?? undefined"
			:image="card.image ?? undefined"
			:description="card.description"
			:href="card.external_url ?? undefined"
			:to="card.page?.permalink ?? resourcePermalink(card.resource) ?? undefined"
		/>
	</div>
</template>

<style lang="scss" scoped>
.block-cardgroup {
	display: grid;
	grid-template-columns: repeat(var(--columns), 1fr);
	gap: var(--space-8);
}
</style>
