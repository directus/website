<script setup lang="ts">
import type { ComponentType } from '../../types/schema';
import type { BlockProps } from './types';

const { $directus, $readItem } = useNuxtApp();

const props = defineProps<BlockProps>();

const { data: block } = useAsyncData(props.uuid, () =>
	$directus.request(
		$readItem('block_columns', props.uuid, {
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
	comp_cards: resolveComponent('CompCards'),
};
</script>

<template>
	<div v-if="block" class="block-columns">
		<div class="column col-one">
			<component :is="components[row.collection!]" v-for="row in block.col_one" :key="row.id" :uuid="row.item" />
		</div>
		<div class="column col-two">
			<component :is="components[row.collection!]" v-for="row in block.col_two" :key="row.id" :uuid="row.item" />
		</div>
	</div>
</template>

<style scoped lang="scss">
.block-columns {
	position: relative;
	width: 100%;

	@media (width > 50rem) {
		display: flex;
		gap: var(--space-16);
	}
}

:deep(.column) {
	width: 100%;
	> * + * {
		margin-top: var(--space-4);
	}

	@media (width > 50rem) {
		width: 50%;
	}
}
</style>
