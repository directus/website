<script setup lang="ts">
const { $directus, $readItem } = useNuxtApp();
const props = defineProps<{ uuid: string }>();

const { data: block } = useAsyncData(props.uuid, () =>
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
</script>

<template>
	<div v-if="block" :class="['masonry-grid', block.grid_layout]">
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
