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
		<BlockTier v-for="{ block_tier_id: tier } in block.tiers" :key="tier" :uuid="tier" />
	</div>
</template>

<style lang="scss" scoped>
.block-tier-group {
	gap: var(--space-8);
	display: flex;
	flex-wrap: wrap;
	justify-content: center;
	align-items: stretch;
}
</style>
