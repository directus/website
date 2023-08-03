<script setup lang="ts">
import type { BlockProps } from './types';

const { $directus, $readItem } = useNuxtApp();

const props = defineProps<BlockProps>();

const { data: block } = useAsyncData(props.uuid, () =>
	$directus.request(
		$readItem('block_columns', props.uuid, {
			fields: [
				{
					col_a: ['id', 'collection', 'item'],
					col_b: ['id', 'collection', 'item'],
				},
			],
		})
	)
);
</script>

<template>
	<div v-if="block" class="block-columns">
		<div class="column">
			<BaseBlock v-for="row in block.col_a" :key="row.id" :type="row.collection" :uuid="row.item" />
		</div>

		<div class="column">
			<BaseBlock v-for="row in block.col_b" :key="row.id" :type="row.collection" :uuid="row.item" />
		</div>
	</div>
</template>

<style scoped>
.block-columns {
	display: grid;
	position: relative;
	grid-template-columns: repeat(2, 1fr);
	gap: var(--space-16);
	container-type: inline-size;
	flex-wrap: wrap;
}

.block-columns .column {
	grid-column: auto / span 2;

	@container (width > 50rem) {
		grid-column: auto / span 1;
	}
}
</style>
