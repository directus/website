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
				<td>
					<span v-tooltip="row.tooltip">
						{{ row.name }}
						<BaseIcon name="info" size="x-small" />
					</span>
				</td>
				<td v-for="(col, index) in row.cols" :key="index" :title="col.tooltip">
					<BaseIcon v-if="col.value === 'true'" class="true" name="check" />
					<BaseIcon v-else-if="col.value === 'false'" class="false" name="horizontal_rule" />
					<template v-else>{{ col.value }}</template>
				</td>
			</tr>
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

	.base-icon {
		--base-icon-color: var(--gray-400);
		vertical-align: -3px;

		&:hover {
			color: var(--foreground);
			cursor: help;
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
</style>
