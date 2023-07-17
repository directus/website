<script setup lang="ts">
import { BlockColumns } from '~~/types';

defineProps<{
	data: BlockColumns;
}>();

// Column Component Map
const map = (collection: string) => {
	const mapping = {
		comp_quote: resolveComponent('CompQuote'),
		comp_heading: resolveComponent('CompHeading'),
		comp_button_groups: resolveComponent('CompButtonGroup'),
		comp_metrics: resolveComponent('CompMetrics'),
		comp_media: resolveComponent('CompMedia'),
		comp_cards: resolveComponent('CompCards'),
	};

	return mapping[collection] || 'div';
};
</script>

<template>
	<div class="block-columns">
		<div class="column">
			<component v-for="row in data.col_one" :key="row.id" :is="map(row.collection)" :data="row.item" />
		</div>
		<div class="column">
			<component v-for="row in data.col_two" :key="row.id" :is="map(row.collection)" :data="row.item" />
		</div>
	</div>
</template>

<style>
.block-columns {
	display: flex;
	position: relative;
	width: 100%;

	gap: var(--space-16);

	.column {
		width: 50%;
		> * + * {
			margin-top: var(--space-8);
		}
	}
}
</style>
