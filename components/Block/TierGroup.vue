<script setup lang="ts">
import type { BlockProps } from './types';

const { $directus, $readItem } = useNuxtApp();

const props = defineProps<BlockProps>();

const { data: block } = useAsyncData(props.uuid, () =>
	$directus.request(
		$readItem('block_tier_group', props.uuid, {
			fields: [{ tiers: ['block_tier_id'] }],
		}),
	),
);
</script>

<template>
	<div v-if="block" class="block-tier-group">
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
