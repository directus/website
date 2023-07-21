<script setup lang="ts">
import { readItem } from '@directus/sdk';
import { BlockProps } from './types';

const { $directus } = useNuxtApp();

const props = defineProps<BlockProps>();

const { data: block } = useAsyncData(() =>
	$directus.request(
		readItem('block_hero_headline', props.uuid, {
			fields: ['heading', 'subheading', { button_group: [{ buttons: ['page', 'external_url', 'variant', 'label'] }] }],
		})
	)
);
</script>

<template>
	<div v-if="block" class="hero-headline">
		<BaseHeading size="title" align="center" :content="block.heading" />
		<BaseText align="center" :content="block.subheading" />
		<BaseButtonGroup class="buttons">
			<BaseButton
				v-for="(button, idx) in block.button_group?.buttons"
				:key="idx"
				:href="button.page ?? button.external_url ?? undefined"
				:variant="button.variant"
			>
				{{ button.label }}
			</BaseButton>
		</BaseButtonGroup>
	</div>
</template>

<style scoped>
.hero-headline {
	padding-top: var(--space-12);
	padding-bottom: var(--space-12);
	max-width: 64rem;
	margin-left: auto;
	margin-right: auto;
}

.hero-headline > * + * {
	margin-top: var(--space-8);
}

.hero-headline .base-text {
	margin-left: auto;
	margin-right: auto;
	max-width: 48rem;
}

.buttons {
	width: 100%;
	margin-left: auto;
	margin-right: auto;
	display: flex;
	justify-content: center;
}
</style>
