<script setup lang="ts">
import type { BlockProps } from './types';
import useVisualEditing from '~/composables/useVisualEditing';

const { $directus, $readItem } = useNuxtApp();
const { autoApply, setAttr, isVisualEditingEnabled } = useVisualEditing();

const props = defineProps<BlockProps>();

const { data: block, refresh } = useAsyncData(props.uuid, () =>
	$directus.request(
		$readItem('block_table', props.uuid, {
			fields: ['id', 'title', 'columns', 'rows'],
		}),
	),
);

autoApply(`[data-block-id="${props.uuid}"]`, refresh);
</script>

<template>
	<div
		v-if="block"
		class="table-container"
		:data-block-id="props.uuid"
		:data-directus="
			isVisualEditingEnabled
				? setAttr({
						collection: 'block_table',
						item: block.id,
						fields: ['title', 'columns', 'rows'],
						mode: 'modal',
					})
				: undefined
		"
	>
		<table v-if="block" class="block-table">
			<thead>
				<tr>
					<th class="title sticky-col sticky-header">{{ block.title }}</th>
					<th v-for="{ label } in block.columns" :key="label" class="column-label sticky-header">{{ label }}</th>
				</tr>
			</thead>
			<tbody>
				<template v-for="row in block.rows" :key="row.name">
					<tr v-if="!row.hide_row">
						<td class="sticky-col">
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
	</div>
</template>

<style lang="scss" scoped>
.table-container {
	width: 100%;
	overflow-x: auto;
	position: relative;
}

table,
thead,
tbody {
	inline-size: 100%;
	display: block;
	margin-inline: auto;
}

table {
	width: 100%;
	border-collapse: separate;
	border-spacing: 0;
}

thead {
	background-color: var(--background);
	border-block-end: 1px solid var(--gray-200);
}

tr {
	display: flex;
	align-items: baseline;
	font-size: 0.6rem;
	line-height: 0.6rem;
	padding-block: var(--space-2);

	@container (width > 20rem) {
		font-size: var(--font-size-sm);
		line-height: var(--line-height-sm);
	}
}

td,
th {
	flex-basis: var(--space-24);
	flex-grow: 1;
	min-width: var(--space-24);

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
	@media (max-width: 768px) {
		.has-tooltip .base-icon {
			display: none;
		}
	}

	&:first-child {
		flex-grow: 4;
	}

	&:not(:first-child) {
		text-align: end;
	}
}

tbody tr {
	border-block-start: 1px solid var(--gray-200);

	&:first-child {
		border-block-start: none;
	}

	&:last-child {
		border-block-end: 1px solid var(--gray-200);
	}
}

.title {
	text-align: start;
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

.sticky-col {
	position: sticky;
	left: 0;
	top: 0;
	z-index: 3;
	min-width: var(--space-36);
	background-color: var(--background);

	&::after {
		content: '';
		position: absolute;
		top: 0;
		right: -1rem;
		width: 1rem;
		height: 100%;
		background: linear-gradient(to right, var(--background), rgba(255, 255, 255, 0));
		z-index: 1;
	}
}
</style>
