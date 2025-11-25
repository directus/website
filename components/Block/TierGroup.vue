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

const tierCount = computed(() => block.value?.tiers?.length ?? 0);

const tierCountClass = computed(() => {
	if (tierCount.value === 1) return 'single-tier';
	if (tierCount.value === 2) return 'two-tiers';
	return null;
});

autoApply(`[data-block-id="${props.uuid}"]`, refresh);
</script>

<template>
	<div
		v-if="block"
		class="block-tier-group"
		:class="tierCountClass"
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
	width: 100%;
}

@media (width > 64rem) {
	.block-tier-group {
		grid-template-columns: repeat(3, 1fr);
		padding: 0;
		width: 100%;
	}

	.block-tier-group.single-tier {
		grid-template-columns: 1fr;
		max-width: 28rem;
		width: 100%;
		margin-inline: auto;
		padding: 0;
	}

	.block-tier-group.two-tiers {
		grid-template-columns: repeat(2, minmax(0, 28rem));
		max-width: fit-content;
		width: auto;
		margin-inline: auto;
		padding: 0;
		gap: var(--space-8);
	}
}
</style>
