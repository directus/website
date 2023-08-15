<script setup lang="ts">
import type { BlockProps } from './types';

const { $directus, $readItem } = useNuxtApp();

const props = defineProps<BlockProps>();

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
		:to="
			hasLink
				? block.external_url ?? block.page?.permalink ?? resourcePermalink(block.resource) ?? undefined
				: undefined
		"
	>
		<BaseDirectusImage v-if="block.image" class="image" :uuid="block.image.id" :alt="block.image.description ?? ''" />
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
	background-color: color-mix(in srgb, transparent, var(--white) 50%);
	color: inherit;
	transition: border-color var(--duration-150) var(--ease-out);
	text-decoration: none;

	&:is(a):hover {
		border-color: var(--gray-400);
		transition: none;
	}
}

.image {
	height: var(--space-6);
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
