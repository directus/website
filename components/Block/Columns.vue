<script setup lang="ts">
import { readItem } from '@directus/sdk';
import { BlockProps } from './types';

const { $directus } = useNuxtApp();

const props = defineProps<BlockProps>();

const { data: block } = useAsyncData(() =>
	$directus.request(
		readItem('block_columns', props.uuid, {
			fields: [
				{
					col_one: ['collection', 'item'],
					col_two: ['collection', 'item'],
				},
			],
		})
	)
);

// defineProps<{
// 	data: BlockColumns;
// }>();

// // Column Component Map
// const map = (collection: string) => {
// 	const mapping = {
// 		comp_quote: resolveComponent('CompQuote'),
// 		comp_heading: resolveComponent('CompHeading'),
// 		comp_button_groups: resolveComponent('CompButtonGroup'),
// 		comp_metrics: resolveComponent('CompMetrics'),
// 		comp_media: resolveComponent('CompMedia'),
// 		comp_cards: resolveComponent('CompCards'),
// 	};

// 	return mapping[collection] || 'div';
// };
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

<style scoped>
.block-columns {
	display: flex;
	position: relative;
	width: 100%;

	gap: var(--space-16);
}

.block-columns .column {
	width: 50%;
}

.block-columns .column > * + * {
	margin-top: var(--space-8);
}
</style>
