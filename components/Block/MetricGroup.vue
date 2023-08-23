<script setup lang="ts">
import type { BlockProps } from './types';

const { $directus, $readItem } = useNuxtApp();

const props = defineProps<BlockProps>();

const { data: block } = useAsyncData(props.uuid, () =>
	$directus.request(
		$readItem('block_metric_group', props.uuid, {
			fields: [{ items: ['id', 'block_metric_id'] }],
		})
	)
);
</script>

<template>
	<div v-if="block" class="block-metric-group">
		<BlockMetric v-for="metric in block.items" :key="metric.id" :uuid="metric.block_metric_id" />
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

		:deep(> :nth-child(odd)) {
			border-inline-end: 1px solid var(--gray-200);
			padding-right: var(--space-8);
		}
	}

	@container (width > 50rem) {
		--columns: 4;

		:deep(> *:not(:last-child)) {
			border-inline-end: 1px solid var(--gray-200);
			padding-right: var(--space-10);
		}
	}
}
</style>
