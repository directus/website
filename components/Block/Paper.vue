<script setup lang="ts">
import type { BlockProps } from './types';

const { $directus, $readItem } = useNuxtApp();

const props = defineProps<BlockProps>();

const { data: block } = useAsyncData(props.uuid, () =>
	$directus.request(
		$readItem('block_paper', props.uuid, {
			fields: ['background', 'padding', { blocks: ['id', 'collection', 'item'] }],
		}),
	),
);
</script>

<template>
	<ThemeProvider
		v-if="block"
		:variant="['dark-night', 'colorful', 'primary'].includes(block.background) ? 'dark' : null"
	>
		<div class="block-paper" :class="[`padding-${block.padding}`, `bg-${block.background}`]">
			<BaseBlock v-for="row in block.blocks" :key="row.id" class="block" :type="row.collection" :uuid="row.item" />
		</div>
	</ThemeProvider>
</template>

<style lang="scss" scoped>
.block-paper {
	background-color: var(--background);
	border-radius: var(--rounded-2xl);

	@container (width > 35rem) {
		padding: var(--space-20);
	}
}

.padding-small {
	padding: var(--space-5);
}

.padding-normal {
	padding: var(--space-10);
}

.padding-large {
	padding: var(--space-16);
}

.block + .block {
	margin-block-start: var(--space-4);

	@container (width > 35rem) {
		margin-block-start: var(--space-8);
	}
}

.bg-pristine-white {
	box-shadow: var(--shadow-lg);
}

.bg-simple-gray {
	background-color: var(--gray-100);
}

.bg-primary {
	background-color: var(--primary-600);
}

.bg-primary-light {
	background-color: var(--primary-50);
}

.bg-colorful {
	background: url('~/assets/svg/gradient.svg');
	background-size: cover;
}
</style>
