<script setup lang="ts">
import { readItem } from '@directus/sdk';
import type { ComponentType } from '../../types/schema';
import type { BlockProps } from './types';

const { $directus } = useNuxtApp();

const props = defineProps<BlockProps>();

const { data: block } = useAsyncData(props.uuid, () =>
	$directus.request(
		readItem('block_columns', props.uuid, {
			fields: [
				{
					col_one: ['id', 'collection', 'item'],
					col_two: ['id', 'collection', 'item'],
				},
			],
		})
	)
);

const components: Record<ComponentType, ReturnType<typeof resolveComponent>> = {
	comp_quote: resolveComponent('CompQuote'),
	comp_heading: resolveComponent('CompHeading'),
	comp_button_group: resolveComponent('CompButtonGroup'),
	comp_metrics: resolveComponent('CompMetrics'),
	comp_media: resolveComponent('CompMedia'),
};
</script>

<template>
	<div v-if="block" class="block-columns">
		<div class="column">
			<component :is="components[row.collection!]" v-for="row in block.col_one" :key="row.id" :uuid="row.item" />
		</div>
		<div class="column">
			<component :is="components[row.collection!]" v-for="row in block.col_two" :key="row.id" :uuid="row.item" />
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
