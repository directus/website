<script setup lang="ts">
import type { BlockProps } from './types';

const { $directus, $readItem } = useNuxtApp();

const props = defineProps<BlockProps>();

const { data: block } = useAsyncData(props.uuid, () =>
	$directus.request(
		$readItem('block_table', props.uuid, {
			fields: ['title', 'columns', 'rows'],
		})
	)
);
</script>

<template>
	<table v-if="block" class="block-table">
		<thead>
			<tr>
				<td class="title">{{ block.title }}</td>
				<td v-for="{ label } in block.columns" :key="label" class="column-label">{{ label }}</td>
			</tr>
		</thead>
		<tbody>
			<tr v-for="row in block.rows" :key="row.name">
				<td :title="row.tooltip">{{ row.name }}</td>
				<td v-for="(col, index) in row.cols" :key="index" :title="col.tooltip">{{ col.value }}</td>
			</tr>
		</tbody>
	</table>
</template>

<style lang="scss" scoped>
table {
	grid-column: narrow !important;
}

table,
thead,
tbody {
	inline-size: 100%;
	max-inline-size: 62.5rem;
	display: block;
	margin-inline: auto;
}

tr {
	display: flex;
	align-items: center;
	font-size: 0.6rem;
	line-height: 0.6rem;

	@container (width > 20rem) {
		font-size: var(--font-size-sm);
		line-height: var(--line-height-sm);
	}
}

td {
	flex-basis: var(--space-24);
	flex-grow: 1;

	&:first-child {
		flex-grow: 4;
	}

	&:not(:first-child) {
		text-align: end;
	}
}

thead tr {
	margin-block-end: var(--space-2);
}

tbody tr {
	padding-block: var(--space-2);
	border-block-start: 1px solid var(--gray-200);

	&:last-child {
		border-block-end: 1px solid var(--gray-200);
	}
}

.title {
	font-size: var(--font-size-2xl);
	line-height: var(--line-height-2xl);
	font-family: var(--family-display);
	font-weight: 600;
}

.column-label {
	color: var(--purple-400);
	font-family: var(--family-display);
	font-size: var(--font-size-xs);
	line-height: var(--line-height-xs);
	text-transform: uppercase;
	font-weight: 600;
}
</style>
