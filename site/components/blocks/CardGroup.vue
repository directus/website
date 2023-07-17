<script setup lang="ts">
import { BlockCardGroup } from '~~/types';

const props = defineProps<{
	data: BlockCardGroup;
}>();

const map = (variant: string) => {
	const mapping = {
		white: resolveComponent('CardsWhite'),
		gray: resolveComponent('CardsGray'),
		resource: resolveComponent('BaseCard'),
	};

	return mapping[variant] || 'div';
};
</script>

<template>
	<div :class="[`${data.variant}-group`, 'block-cardgroup']">
		<component
			:is="map(data.variant)"
			v-for="card in data.cards"
			:key="card.id"
			:title="card.title"
			:image="card.image"
			:description="card.description"
			:button="card.button"
			:href="card.href"
		/>
	</div>
</template>

<style>
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
