<script setup lang="ts">
import type { BlockProps } from './types';

const { $directus, $readItem } = useNuxtApp();

const props = defineProps<BlockProps>();

const { data: block } = useAsyncData(props.uuid, () =>
	$directus.request(
		$readItem('block_metric', props.uuid, {
			fields: ['value', 'description', { image: ['id', 'description'] }],
		})
	)
);
</script>

<template>
	<div v-if="block" class="block-metric-container">
		<BaseDirectusImage v-if="block.image" class="image" :uuid="block.image.id" :alt="block.image.description ?? ''" />
		<div class="value">{{ block.value }}</div>
		<div v-if="block.description" class="description">{{ block.description }}</div>
	</div>
</template>

<style lang="scss" scoped>
.block-metric-container {
	container-type: inline-size;
	border: 1px solid var(--gray-200);
	border-radius: var(--rounded-lg);
	padding: var(--space-5) var(--space-7);
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: flex-start;
	background-color: color-mix(in srgb, transparent, var(--white) 50%);
}

.image {
	height: var(--space-6);
	margin-block-end: var(--space-4);
}

.value {
	font-weight: 400;
	font-size: var(--font-size-5xl);
	line-height: var(--line-height-5xl);
}

.description {
	color: var(--gray-400);
	margin-block-start: var(--space-2);
}
</style>
