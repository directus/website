<script setup lang="ts">
import type { BlockProps } from './types';
import useVisualEditing from '~/composables/useVisualEditing';

const { $directus, $readItem } = useNuxtApp();
const { autoApply, setAttr, isVisualEditingEnabled } = useVisualEditing();

const props = defineProps<BlockProps>();

const { data: block, refresh } = useAsyncData(props.uuid, () =>
	$directus.request(
		$readItem('block_metric_group', props.uuid, {
			fields: ['id', 'background', { items: ['id', 'block_metric_id'] }],
		}),
	),
);

autoApply(`[data-block-id="${props.uuid}"]`, refresh);
</script>

<template>
	<div
		v-if="block"
		class="block-metric-group"
		:data-block-id="props.uuid"
		:data-directus="
			isVisualEditingEnabled
				? setAttr({
						collection: 'block_metric_group',
						item: block.id,
						fields: ['background', 'items'],
						mode: 'modal',
					})
				: undefined
		"
	>
		<BlockMetric
			v-for="metric in block.items"
			:key="metric.id"
			:background="block.background"
			:uuid="metric.block_metric_id as string"
		/>
	</div>
</template>

<style lang="scss" scoped>
.block-metric-group {
	--columns: 1;

	display: grid;
	grid-template-columns: repeat(var(--columns), 1fr);
	gap: var(--space-8);

	@container (width > 35rem) {
		--columns: 2;

		gap: var(--space-10);
	}

	@container (width > 50rem) {
		--columns: 4;
	}
}
</style>
