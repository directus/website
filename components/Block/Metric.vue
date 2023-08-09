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
		<div class="value">{{ block.value }}</div>
		<div class="description">{{ block.description }}</div>
		<BaseDirectusImage v-if="block.image" :uuid="block.image.id" :alt="block.image.description ?? ''" />
	</div>
</template>

<style lang="scss" scoped>
.block-metric-container {
	container-type: inline-size;
}

.value {
	font-weight: 400;
	font-size: var(--font-size-5xl);
	line-height: var(--line-height-5xl);
}

.description {
	color: var(--gray-400);
}
</style>
