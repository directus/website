<script setup lang="ts">
import type { BlockProps } from './types';

const { $directus, $readItem } = useNuxtApp();

const props = defineProps<BlockProps>();

const { data: block } = useAsyncData(props.uuid, () =>
	$directus.request(
		$readItem('block_header', props.uuid, {
			fields: [
				'preheading',
				'heading',
				'subheading',
				'alignment',
				'heading_size',
				'heading_tag',
				'button_group',
				'subheading_color',
				'subheading_type',
			],
		}),
	),
);
</script>

<template>
	<div v-if="block" class="header" :class="[`align-${block.alignment}`, `size-${block.heading_size}`]">
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
			:color="block.subheading_color"
			:type="block.subheading_type"
			size="large"
		/>
		<BlockButtonGroup
			v-if="block.button_group"
			class="buttons"
			:uuid="block.button_group as string"
			:align="block.alignment"
		/>
	</div>
</template>

<style lang="scss" scoped>
.header {
	padding-inline-end: var(--column-inset-inline-end);
}

.header > * + * {
	margin-block-start: var(--space-3);
}

.buttons {
	margin-block-start: var(--space-8);
}

.heading {
	max-inline-size: 50rem;
}

.text {
	max-inline-size: 45rem;
}

.align-center {
	.heading,
	.text,
	.badge {
		margin-inline: auto;
	}
}

.size-large {
	@container (width > 35rem) {
		& > * + * {
			margin-block-start: var(--space-4);
		}
	}
}

.size-title {
	grid-column: standard !important;

	.heading {
		max-inline-size: none;
	}

	.text {
		max-inline-size: 50rem;
	}

	& > * + * {
		margin-block-start: var(--space-8);
	}

	.badge + .heading {
		margin-block-start: var(--space-3);
	}
}
</style>
