<script setup lang="ts">
import type { BlockProps } from './types';

interface BlockMetricGroupProps extends BlockProps {
	background: 'transparent' | 'pristine-white';
}

const { $directus, $readItem } = useNuxtApp();

const props = defineProps<BlockMetricGroupProps>();

const { data: block } = useAsyncData(props.uuid, () =>
	$directus.request(
		$readItem('block_metric', props.uuid, {
			fields: [
				'value',
				'description',
				'external_url',
				{ page: ['permalink'], resource: ['type', 'slug'], image: ['id', 'description'] },
			],
		})
	)
);

const hasLink = computed(() => !!unref(block)?.page || !!unref(block)?.external_url || !!unref(block)?.resource);

const component = computed(() => {
	if (unref(hasLink)) return resolveComponent('NuxtLink');
	return 'div';
});
</script>

<template>
	<component
		:is="component"
		v-if="block"
		class="block-metric-container"
		:class="`background-${background}`"
		:href="
			hasLink
				? block.external_url ?? block.page?.permalink ?? resourcePermalink(block.resource) ?? undefined
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
	border: 1px solid var(--gray-200);
	border-radius: var(--rounded-lg);
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

.image {
	height: var(--space-6);
	max-width: var(--space-12);
	margin-block-end: var(--space-4);
}

.value {
	font-weight: 400;
	font-size: var(--font-size-5xl);
	line-height: var(--line-height-5xl);
}

.description {
	color: var(--gray-400);
	margin-block-start: var(--space-2);
}
</style>
