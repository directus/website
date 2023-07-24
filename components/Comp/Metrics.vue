<script setup lang="ts">
import { readItem } from '@directus/sdk';
import type { CompProps } from './types';

const { $directus } = useNuxtApp();

const props = defineProps<CompProps>();

const { data: comp } = useAsyncData(props.uuid, () =>
	$directus.request(
		readItem('comp_metrics', props.uuid, {
			fields: ['id', 'items'],
		})
	)
);
</script>

<template>
	<div v-if="comp" class="comp-metrics">
		<div v-for="item in comp.items" :key="item.value" class="metric">
			<BaseHeading :content="item.value" />
			<p>{{ item.description }}</p>
		</div>
	</div>
</template>

<style>
.comp-metrics {
	display: grid;
	grid-template-columns: repeat(3, 1fr);
	grid-gap: 1rem;
}

.comp-metrics p {
	color: var(--gray-500);
	font-family: var(--family-body);
}
</style>
