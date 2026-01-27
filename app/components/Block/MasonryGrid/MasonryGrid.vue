<script setup lang="ts">
import useVisualEditing from '~/composables/useVisualEditing';

const { $directus, $readItem } = useNuxtApp();
const { autoApply, setAttr, isVisualEditingEnabled } = useVisualEditing();

const props = defineProps<{ uuid: string }>();

const { data: block, refresh } = useAsyncData(props.uuid, () =>
	$directus.request(
		$readItem('block_masonry_grid', props.uuid, {
			fields: ['id', 'grid_layout', { cards: ['block_masonry_grid_card_id'] }],
		}),
	),
);

const limitedCards = computed(() => {
	if (!block.value || !block.value.cards) return [];

	switch (block.value.grid_layout) {
		case 'six_cards':
			return block.value.cards.slice(0, 6);
		case 'four_cards':
			return block.value.cards.slice(0, 4);
		case 'two_cards':
			return block.value.cards.slice(0, 2);
		default:
			return block.value.cards;
	}
});

autoApply(`[data-block-id="${props.uuid}"]`, refresh);
</script>

<template>
	<div
		v-if="block"
		:class="['masonry-grid', block.grid_layout]"
		:data-block-id="props.uuid"
		:data-directus="
			isVisualEditingEnabled
				? setAttr({
						collection: 'block_masonry_grid',
						item: block.id,
						fields: ['grid_layout', 'cards'],
						mode: 'modal',
					})
				: undefined
		"
	>
		<BlockMasonryGridCard
			v-for="card in limitedCards"
			:key="card.block_masonry_grid_card_id"
			:uuid="card.block_masonry_grid_card_id"
		/>
	</div>
</template>

<style lang="scss" scoped>
.masonry-grid {
	display: flex;
	flex-wrap: wrap;
	gap: 1%;
	justify-content: space-between;
}
</style>
