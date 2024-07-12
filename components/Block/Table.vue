<script setup lang="ts">
import type { BlockProps } from './types';

const { $directus, $readItem } = useNuxtApp();

const props = defineProps<BlockProps>();

const { data: block } = useAsyncData(props.uuid, () =>
	$directus.request(
		$readItem('block_table', props.uuid, {
			fields: ['title', 'columns', 'rows'],
		}),
	),
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
			<template v-for="row in block.rows" :key="row.name">
				<tr v-if="!row.hide_row">
					<td>
						<span v-tooltip="row.tooltip" :class="{ 'has-tooltip': !!row.tooltip }">
							{{ row.name }}
							<BaseIcon v-if="row.tooltip" name="info" size="x-small" />
						</span>
					</td>
					<td v-for="(col, index) in row.cols" :key="index" :title="col.tooltip">
						<span v-tooltip="col.tooltip" :class="{ 'has-tooltip': !!col.tooltip }">
							<BaseIcon v-if="col.tooltip" name="info" size="x-small" class="icon" />
							<BaseIcon v-if="col.value === 'true'" class="true" name="check" />
							<BaseIcon v-else-if="col.value === 'false'" class="false" name="horizontal_rule" />
							<template v-else>{{ col.value }}</template>
						</span>
					</td>
				</tr>
			</template>
		</tbody>
	</table>
</template>

<style lang="scss" scoped>
table,
thead,
tbody {
	inline-size: 100%;
	display: block;
	margin-inline: auto;
}

thead {
	position: sticky;
	top: 60px;
	background-color: var(--background);
	border-block-end: 1px solid var(--gray-200);
}

tr {
	display: flex;
	align-items: baseline;
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

	.base-icon {
		--base-icon-color: var(--gray-400);
		vertical-align: -3px;
	}

	.has-tooltip {
		cursor: help;

		&:hover {
			.base-icon {
				--base-icon-color: var(--foreground);
			}
		}
	}

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

	&:first-child {
		border-block-start: none;
	}

	&:last-child {
		border-block-end: 1px solid var(--gray-200);
	}
}

.title {
	font-family: var(--family-display);
	font-weight: 600;

	@container (width > 30rem) {
		font-size: var(--font-size-2xl);
		line-height: var(--line-height-2xl);
	}
}

.column-label {
	color: var(--primary);
	font-family: var(--family-display);
	font-size: var(--font-size-xs);
	line-height: var(--line-height-xs);
	text-transform: uppercase;
	font-weight: 600;
}

.true,
.false {
	vertical-align: middle;
}

.true {
	color: var(--primary);
}

.false {
	color: var(--gray-300);
}

.icon {
	margin-inline-end: var(--space-1);
}
</style>
