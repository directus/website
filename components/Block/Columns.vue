<script setup lang="ts">
import type { BlockProps } from './types';

const { $directus, $readItem } = useNuxtApp();

const props = defineProps<BlockProps>();

const { data: block } = useAsyncData(props.uuid, () =>
	$directus.request(
		$readItem('block_columns', props.uuid, {
			fields: [
				'layout',
				{
					col_a: ['id', 'collection', 'item'],
					col_b: ['id', 'collection', 'item'],
				},
			],
		}),
	),
);

const fillBlocks = ['block_quote', 'block_code'];
</script>

<template>
	<div v-if="block" class="block-columns" :class="`layout-${block.layout ?? '1-1'}`">
		<div class="column">
			<BaseBlock
				v-for="row in block.col_a"
				:key="row.id"
				:class="{ fill: fillBlocks.includes(row.collection) }"
				:type="row.collection"
				:uuid="row.item"
			/>
		</div>

		<div class="column">
			<BaseBlock
				v-for="row in block.col_b"
				:key="row.id"
				:class="{ fill: fillBlocks.includes(row.collection) }"
				:type="row.collection"
				:uuid="row.item"
			/>
		</div>
	</div>
</template>

<style lang="scss" scoped>
.block-columns {
	display: grid;
	position: relative;
	gap: var(--space-8);
	flex-wrap: wrap;

	&.layout-1-1 {
		grid-template-columns: repeat(2, 1fr);
	}

	&.layout-2-1 {
		grid-template-columns: 2fr 1fr;
	}

	&.layout-1-2 {
		grid-template-columns: 1fr 2fr;
	}

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

	.fill {
		height: 100%;
	}

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
