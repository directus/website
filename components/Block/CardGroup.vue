<script setup lang="ts">
import { readItem } from '@directus/sdk';
import type { BlockCardGroup } from '~/types/schema';
import type { BlockProps } from './types';

const { $directus } = useNuxtApp();

const props = defineProps<BlockProps>();

const variants: Record<BlockCardGroup['variant'], ReturnType<typeof resolveComponent>> = {
	gray: resolveComponent('CardGray'),
	white: resolveComponent('CardWhite'),
	resource: resolveComponent('CardBase'),
};

const { data: block } = useAsyncData(() =>
	$directus.request(
		readItem('block_cardgroup', props.uuid, {
			fields: [
				'variant',
				{
					cards: [
						'id',
						'title',
						'image',
						'description',
						'href',
						{ button: ['label', 'external_url', 'page', 'variant'] },
					],
				},
			],
		})
	)
);
</script>

<template>
	<div v-if="block" :class="[`${block.variant}-group`, 'block-cardgroup']">
		<component
			:is="variants[block.variant]"
			v-for="card in block.cards"
			:key="card.id"
			:title="card.title"
			:image="card.image"
			:description="card.description"
			:button="{
				href: card.button.page ?? card.button.external_url,
				variant: card.button.variant,
			}"
			:href="card.href"
		/>
	</div>
</template>

<style scoped>
.gray-group {
	display: grid;
	grid-template-columns: repeat(2, 1fr);
	gap: var(--space-8);
}

.white-group {
	display: grid;
	grid-template-columns: repeat(3, 1fr);
	gap: var(--space-8);
}

.resource-group {
	display: grid;
	grid-template-columns: repeat(1, 1fr);
	gap: var(--space-8);
}
</style>
