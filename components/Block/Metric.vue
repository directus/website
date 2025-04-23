<script setup lang="ts">
import type { BlockProps } from './types';
import { resourcePermalink } from '~/utils/resourcePermalink';
import useVisualEditing from '~/composables/useVisualEditing';

interface BlockMetricGroupProps extends BlockProps {
	background: 'transparent' | 'pristine-white' | 'simple-gray';
}

const { $directus, $readItem } = useNuxtApp();
const { autoApply, setAttr, isVisualEditingEnabled } = useVisualEditing();

const props = defineProps<BlockMetricGroupProps>();

const { data: block, refresh } = useAsyncData(props.uuid, () =>
	$directus.request(
		$readItem('block_metric', props.uuid, {
			fields: [
				'id',
				'value',
				'description',
				'external_url',
				{ page: ['permalink'], resource: ['type', 'slug'], image: ['id', 'description'] },
			],
		}),
	),
);

const hasLink = computed(() => !!unref(block)?.page || !!unref(block)?.external_url || !!unref(block)?.resource);

const component = computed(() => {
	if (unref(hasLink)) return resolveComponent('NuxtLink');
	return 'div';
});

autoApply(`#metric-${props.uuid}`, refresh);
</script>

<template>
	<component
		:is="component"
		v-if="block"
		class="block-metric-container"
		:class="`background-${background}`"
		:id="`metric-${uuid}`"
		:data-block-id="uuid"
		:href="
			hasLink
				? (block.external_url ?? block.page?.permalink ?? resourcePermalink(block.resource) ?? undefined)
				: undefined
		"
		:data-directus="
			isVisualEditingEnabled
				? setAttr({
						collection: 'block_metric',
						item: block.id,
						fields: ['value', 'description', 'external_url', 'image'],
						mode: 'modal',
					})
				: undefined
		"
	>
		<BaseDirectusImage
			v-if="block.image"
			class="image"
			:width="48"
			:height="48"
			:uuid="block.image.id"
			:alt="block.image.description ?? ''"
		/>
		<div class="value">{{ block.value }}</div>
		<div v-if="block.description" class="description">{{ block.description }}</div>
	</component>
</template>

<style lang="scss" scoped>
.block-metric-container {
	border: 1px solid var(--gray-100);
	border-radius: var(--rounded-2xl);
	padding: var(--space-5) var(--space-7);
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: flex-start;
	color: inherit;
	transition: border-color var(--duration-150) var(--ease-out);
	text-decoration: none;

	&:is(a):hover {
		border-color: var(--gray-400);
		transition: none;
	}
}

.background-pristine-white {
	background: var(--background);
}

.background-simple-gray {
	background: var(--gray-100);
}

.image {
	height: var(--space-6);
	max-width: var(--space-12);
	margin-block-end: var(--space-4);
}

.value {
	font-weight: 300;
	font-size: var(--font-size-5xl);
	line-height: var(--line-height-5xl);
}

.description {
	color: var(--gray-400);
	margin-block-start: var(--space-2);
}
</style>
