<script setup lang="ts">
import type { BlockProps } from './types';

const { $directus, $readItem } = useNuxtApp();

const props = defineProps<BlockProps>();

const { data: block } = useAsyncData(props.uuid, () =>
	$directus.request(
		$readItem('block_cardgroup', props.uuid, {
			fields: [
				'variant',
				{
					cards: ['id', 'title', 'image', 'description', 'href'],
				},
			],
		})
	)
);
</script>

<template>
	<div v-if="block" :class="[`${block.variant}-group`, 'block-cardgroup']">
		<BaseCard
			v-for="card in block.cards"
			:key="card.id"
			:title="card.title ?? undefined"
			:image="card.image"
			:description="card.description"
			:href="card.href ?? undefined"
		/>
	</div>
</template>

<style scoped>
.block-cardgroup {
	--columns: 2;

	display: grid;
	grid-template-columns: repeat(var(--columns), 1fr);
	gap: var(--space-8);
}

.gray-group {
	--columns: 2;
}

.white-group {
	--columns: 3;
}

.resource-group {
	--columns: 1;
}
</style>
