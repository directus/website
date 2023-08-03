<script setup lang="ts">
import type { BlockProps } from './types';

const { $directus, $readItem } = useNuxtApp();

const props = defineProps<BlockProps>();

const { data: block } = useAsyncData(props.uuid, () =>
	$directus.request(
		$readItem('block_card_group', props.uuid, {
			fields: ['direction', 'aspect_ratio', { cards: ['block_card_id'] }],
		})
	)
);
</script>

<template>
	<div v-if="block" :class="[`direction-${block.direction ?? 'horizontal'}`, 'block-cardgroup']">
		<BlockCard v-for="{ block_card_id: card } in block.cards" :key="card" :uuid="card" />
	</div>
</template>

<style lang="scss" scoped>
.block-cardgroup {
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(var(--space-40), 1fr));
	gap: var(--space-8);
}
</style>
