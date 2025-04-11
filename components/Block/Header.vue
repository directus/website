<script setup lang="ts">
import type { BlockProps } from './types';
import useVisualEditing from '~/composables/useVisualEditing';

const { $directus, $readItem } = useNuxtApp();
const { autoApply, setAttr, isVisualEditingEnabled } = useVisualEditing();

const props = defineProps<BlockProps>();

const { data: block, refresh } = useAsyncData(props.uuid, () =>
	$directus.request(
		$readItem('block_header', props.uuid, {
			fields: [
				'id',
				'preheading',
				'heading',
				'subheading',
				'alignment',
				'heading_size',
				'heading_tag',
				'button_group',
				'subheading_color',
				'subheading_type',
				'command',
			],
		}),
	),
);

autoApply(`[data-block-id="${props.uuid}"]`, refresh);
</script>

<template>
	<div
		v-if="block"
		class="header"
		:class="[`align-${block.alignment}`, `size-${block.heading_size}`]"
		:data-block-id="props.uuid"
	>
		<BaseBadge
			v-if="block.preheading"
			class="badge"
			caps
			:label="block.preheading"
			:data-directus="
				isVisualEditingEnabled
					? setAttr({
							collection: 'block_header',
							item: block.id,
							fields: 'preheading',
							mode: 'popover',
						})
					: undefined
			"
		/>
		<BaseHeading
			v-if="block.heading"
			class="heading"
			:align="block.alignment === 'left' ? 'start' : 'center'"
			:content="block.heading"
			:size="block.heading_size ?? undefined"
			:tag="block.heading_tag ?? undefined"
			:data-directus="
				isVisualEditingEnabled
					? setAttr({
							collection: 'block_header',
							item: block.id,
							fields: ['heading', 'heading_size', 'heading_tag'],
							mode: 'popover',
						})
					: undefined
			"
		/>
		<BaseText
			v-if="block.subheading"
			class="text"
			:align="block.alignment === 'left' ? 'start' : 'center'"
			:content="block.subheading"
			:color="block.subheading_color"
			:type="block.subheading_type"
			:data-directus="
				isVisualEditingEnabled
					? setAttr({
							collection: 'block_header',
							item: block.id,
							fields: ['subheading', 'subheading_color', 'subheading_type'],
							mode: 'popover',
						})
					: undefined
			"
			size="large"
		/>
		<template v-if="block.command">
			<BaseCliSnippet class="cli-snippet" :command="block.command" />
			<BaseDivider class="separator" />
		</template>
		<BlockButtonGroup
			v-if="block.button_group"
			class="buttons"
			:uuid="block.button_group as string"
			:align="block.alignment"
			:data-directus="
				isVisualEditingEnabled
					? setAttr({
							collection: 'block_header',
							item: block.id,
							fields: 'button_group',
							mode: 'modal',
						})
					: undefined
			"
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

.cli-snippet {
	margin-block-start: var(--space-6);
}

.separator {
	width: 470px;
	margin-inline: auto;
}

.align-center {
	.heading,
	.text,
	.badge,
	.cli-snippet,
	.separator {
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
