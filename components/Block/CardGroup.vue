<script setup lang="ts">
import type { BlockProps } from './types';

const { $directus, $readItem } = useNuxtApp();

const props = defineProps<BlockProps>();

const { data: block } = useAsyncData(props.uuid, () =>
	$directus.request(
		$readItem('block_card_group', props.uuid, {
			fields: [
				'direction',
				'aspect_ratio',
				{
					cards: [
						{
							block_card_id: [
								'id',
								'title',
								'description',
								'external_url',
								'image',
								'image_size',
								{ page: ['permalink'], resource: ['type', 'slug'] },
							],
						},
					],
				},
			],
		})
	)
);
</script>

<template>
	<div v-if="block" :class="[`direction-${block.direction ?? 'horizontal'}`, 'block-cardgroup']">
		<BaseCard
			v-for="{ block_card_id: card } in block.cards"
			:key="card.id"
			:title="card.title ?? undefined"
			:image="card.image ?? undefined"
			:image-size="card.image_size ?? undefined"
			:description="card.description ?? undefined"
			:to="card.external_url ?? card.page?.permalink ?? resourcePermalink(card.resource) ?? undefined"
		/>
	</div>
</template>

<style lang="scss" scoped>
.block-cardgroup {
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(var(--space-60), 1fr));
	gap: var(--space-8);
}
</style>
