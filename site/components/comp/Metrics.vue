<script setup lang="ts">
import { CompMetrics } from '~~/types';

defineProps<{
	data: CompMetrics;
}>();
</script>

<template>
	<div class="comp-metrics">
		<div v-for="(item, itemIdx) in data.items" :key="itemIdx" class="metric">
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

	& p {
		color: var(--gray-500);j
		font-family: var(--family-body);
	}
}
</style>
