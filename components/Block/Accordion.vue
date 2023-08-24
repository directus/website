<script lang="ts" setup>
import type { BlockProps } from './types';

const { $directus, $readItem } = useNuxtApp();

const props = defineProps<BlockProps>();

const { data: block } = useAsyncData(props.uuid, () =>
	$directus.request(
		$readItem('block_accordion', props.uuid, {
			fields: ['title', 'icon', { content: ['id', 'collection', 'item'] }],
		})
	)
);

useSchemaOrg([
	defineQuestion({
		name: unref(block)?.title,
		/* @TODO  Get the content of the first block to use as an answer */
	}),
]);
</script>

<template>
	<details v-if="block" class="block-accordion">
		<summary>
			<BaseIcon v-if="block.icon" :name="block.icon" />
			<span class="title">{{ block.title }}</span>
			<BaseIcon class="expand" name="expand_more" />
		</summary>

		<div class="blocks">
			<BaseBlock
				v-for="child in block.content"
				:key="child.id"
				:type="child.collection"
				:uuid="child.item"
				class="icon"
			/>
		</div>
	</details>
</template>

<style lang="scss" scoped>
details {
	border-block-start: 1px solid var(--gray-200);

	&:last-child {
		border-block-end: 1px solid var(--gray-200);
	}
}

details {
	& > summary {
		list-style: none;
		font-family: var(--family-display);
		font-weight: 600;
		font-size: var(--font-size-2xl);
		line-height: var(--line-height-2xl);
		display: flex;
		align-items: center;
		gap: var(--space-3);
		padding-block: var(--space-5);
		cursor: pointer;

		&:hover .title {
			text-decoration: underline;
		}

		&::marker,
		&::-webkit-details-marker {
			display: none;
		}
	}

	.expand {
		--base-icon-color: var(--gray-400);
		margin-inline-start: auto;
	}

	&[open] {
		.expand {
			rotate: 180deg;
		}
	}

	.blocks {
		padding-block-end: var(--space-5);

		:deep(> * + *) {
			margin-block-start: var(--space-5);
		}
	}
}
</style>
