<script setup lang="ts">
import { readItem } from '@directus/sdk';
import type { BlockProps } from './types';

const { $directus } = useNuxtApp();

const props = defineProps<BlockProps>();

const { data: comp } = useAsyncData(props.uuid, () =>
	$directus.request(
		readItem('block_featuregrid', props.uuid, {
			fields: ['features'],
		})
	)
);
</script>

<template>
	<div v-if="comp" class="feature-grid">
		<div v-for="feature in comp.features" :key="feature.title">
			<BaseHeading size="small" font="body" :icon="feature.icon" :content="feature.title" />
			<BaseText :content="feature.description" />
		</div>
	</div>
</template>

<style scoped>
.feature-grid {
	display: grid;
	grid-template-columns: repeat(3, 1fr);
	grid-gap: 1rem;
}
</style>
