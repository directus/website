<script setup lang="ts">
import type { BlockProps } from './types';
import useVisualEditing from '~/composables/useVisualEditing';

const { $directus, $readItem } = useNuxtApp();
const { autoApply, setAttr, isVisualEditingEnabled } = useVisualEditing();

const props = defineProps<BlockProps>();

const { data: block, refresh } = useAsyncData(props.uuid, () =>
	$directus.request(
		$readItem('block_eyebrow', props.uuid, {
			fields: ['id', 'text', 'href', 'alignment'],
		}),
	),
);

autoApply(`[data-block-id="${props.uuid}"]`, refresh);

const as = computed(() => {
	if (block.value?.href) {
		return resolveComponent('NuxtLink');
	}

	return 'div';
});

const linkProps = computed(() => {
	if (block.value?.href) {
		return { to: block.value.href };
	}

	return {};
});
</script>

<template>
	<div v-if="block" class="eyebrow-wrapper" :class="`align-${block.alignment ?? 'left'}`" :data-block-id="props.uuid">
		<component
			:is="as"
			class="eyebrow"
			v-bind="linkProps"
			:data-directus="
				isVisualEditingEnabled
					? setAttr({
							collection: 'block_eyebrow',
							item: block.id,
							fields: ['text', 'href', 'alignment'],
							mode: 'popover',
						})
					: undefined
			"
		>
			<span class="dot" aria-hidden="true" />
			<span class="label">{{ block.text }}</span>
		</component>
	</div>
</template>

<style lang="scss" scoped>
.eyebrow-wrapper {
	display: flex;

	&.align-center {
		justify-content: center;
	}
}

.eyebrow {
	display: inline-flex;
	align-items: center;
	gap: var(--space-2);
	padding: var(--space-1) var(--space-3);
	background-color: transparent;
	color: #172940;
	border: 1.5px solid #172940;
	border-radius: var(--rounded-full);
	text-decoration: none;
	font-family: var(--family-display);
	font-size: var(--font-size-xs);
	font-weight: 600;
	line-height: var(--line-height-xs);
}

.dot {
	width: 8px;
	height: 8px;
	border-radius: 50%;
	background-color: #4ade80;
	flex-shrink: 0;
	animation: eyebrow-pulse 3s ease-in-out infinite;
}

.label {
	white-space: nowrap;
}

@keyframes eyebrow-pulse {
	0%,
	100% {
		box-shadow: 0 0 0 0 color-mix(in srgb, transparent, #4ade80 60%);
	}

	50% {
		box-shadow: 0 0 0 4px color-mix(in srgb, transparent, #4ade80 0%);
	}
}
</style>
