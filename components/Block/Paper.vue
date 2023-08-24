<script setup lang="ts">
import type { BlockProps } from './types';

const { $directus, $readItem } = useNuxtApp();

const props = defineProps<BlockProps>();

const { data: block } = useAsyncData(props.uuid, () =>
	$directus.request(
		$readItem('block_paper', props.uuid, {
			fields: [{ blocks: ['id', 'collection', 'item'] }],
		})
	)
);
</script>

<template>
	<div v-if="block" class="block-paper">
		<BaseBlock v-for="row in block.blocks" :key="row.id" class="block" :type="row.collection" :uuid="row.item" />
	</div>
</template>

<style lang="scss" scoped>
.block-paper {
	background-color: var(--white);
	box-shadow: var(--shadow-lg);
	padding: var(--space-10);
	border-radius: var(--rounded-2xl);

	@container (width > 35rem) {
		padding: var(--space-20);
	}
}

.block + .block {
	margin-block-start: var(--space-4);

	@container (width > 35rem) {
		margin-block-start: var(--space-8);
	}
}
</style>
