<script setup lang="ts">
import type { BlockProps } from './types';
import useVisualEditing from '~/composables/useVisualEditing';

const { $directus, $readItem } = useNuxtApp();
const { autoApply, setAttr, isVisualEditingEnabled } = useVisualEditing();

const props = defineProps<BlockProps>();

const { data: block, refresh } = useAsyncData(props.uuid, () =>
	$directus.request(
		$readItem('block_tier_group', props.uuid, {
			fields: ['id', { tiers: ['block_tier_id'] }],
		}),
	),
);

autoApply(`[data-block-id="${props.uuid}"]`, refresh);
</script>

<template>
	<div
		v-if="block"
		class="block-tier-group"
		:data-block-id="props.uuid"
		:data-directus="
			isVisualEditingEnabled
				? setAttr({
						collection: 'block_tier_group',
						item: block.id,
						fields: ['tiers'],
						mode: 'modal',
					})
				: undefined
		"
	>
		<BlockTier v-for="{ block_tier_id: tier } in block.tiers" :key="tier as string" :uuid="tier as string" />
	</div>
</template>

<style lang="scss" scoped>
.block-tier-group {
	gap: var(--space-6);
	display: grid;
	grid-template-columns: 1fr;
}

@media (width > 64rem) {
	.block-tier-group {
		grid-template-columns: repeat(3, 1fr);
		padding: 0;
	}
}
</style>
