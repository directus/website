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
					cards: ['id', 'title', 'description', 'href', 'image'],
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
			:image="card.image ?? undefined"
			:description="card.description"
			:href="card.href ?? undefined"
		/>
	</div>
</template>

<style lang="scss" scoped>
.block-cardgroup {
	display: grid;
	grid-template-columns: repeat(var(--columns), 1fr);
	gap: var(--space-8);
}
</style>
