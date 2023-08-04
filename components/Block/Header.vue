<script setup lang="ts">
import { BlockProps } from './types';

const { $directus, $readItem } = useNuxtApp();

const props = defineProps<BlockProps>();

const { data: block } = useAsyncData(props.uuid, () =>
	$directus.request(
		$readItem('block_header', props.uuid, {
			fields: ['preheading', 'heading', 'subheading', 'alignment', 'heading_size', 'heading_tag', 'button_group'],
		})
	)
);
</script>

<template>
	<div v-if="block" class="header" :class="`align-${block.alignment}`">
		<BaseBadge v-if="block.preheading" class="badge" caps :label="block.preheading" />
		<BaseHeading
			v-if="block.heading"
			class="heading"
			:align="block.alignment === 'left' ? 'start' : 'center'"
			:content="block.heading"
			:size="block.heading_size ?? undefined"
			:tag="block.heading_tag ?? undefined"
		/>
		<BaseText
			v-if="block.subheading"
			class="text"
			:align="block.alignment === 'left' ? 'start' : 'center'"
			:content="block.subheading"
			size="large"
		/>
		<BlockButtonGroup v-if="block.button_group" :uuid="block.button_group" />
	</div>
</template>

<style lang="scss" scoped>
.header {
	container-type: inline-size;
	padding-inline-end: var(--column-inset-inline-end);
}

.align-center {
	.badge {
		margin-inline: auto;
	}
}

.header > * + * {
	margin-block-start: var(--space-5);
}

.text {
	max-width: 50rem;
	margin-inline: auto;
}
</style>
