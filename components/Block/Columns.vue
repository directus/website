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
	<div v-if="block" class="block-columns-container">
		<div class="block-columns">
			<div class="column">
				<BaseBlock v-for="row in block.col_a" :key="row.id" :type="row.collection" :uuid="row.item" />
			</div>

			<div class="column">
				<BaseBlock v-for="row in block.col_b" :key="row.id" :type="row.collection" :uuid="row.item" />
			</div>
		</div>
	</div>
</template>

<style lang="scss" scoped>
.block-columns-container {
	container-type: inline-size;
}

.block-columns {
	display: grid;
	position: relative;
	grid-template-columns: repeat(2, 1fr);
	gap: var(--space-8);
	flex-wrap: wrap;

	@container (width > 35rem) {
		gap: var(--space-10);
	}
}

.block-columns .column {
	grid-column: auto / span 2;
	display: flex;
	flex-direction: column;
	justify-content: center;
	gap: var(--space-4);

	@container (width > 35rem) {
		gap: var(--space-8);
	}

	@container (width > 50rem) {
		grid-column: auto / span 1;

		&:first-child {
			--column-inset-inline-end: var(--space-10);
		}

		&:last-child {
			--column-inset-inline-start: var(--space-10);
		}
	}
}
</style>
