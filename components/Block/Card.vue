<script setup lang="ts">
import type { BlockProps } from './types';

const { $directus, $readItem } = useNuxtApp();

interface BlockCardProps extends BlockProps {
	direction?: 'vertical' | 'horizontal';
	mediaStyle?:
		| 'none'
		| 'image-fill-16-9'
		| 'image-fill-1-1'
		| 'image-centered-16-9'
		| 'image-centered-1-1'
		| 'icon-centered-16-9'
		| 'icon-centered-1-1'
		| 'image-title'
		| 'icon-title'
		| 'icon-above-title';
}

const props = withDefaults(defineProps<BlockCardProps>(), {
	direction: 'vertical',
	mediaStyle: 'image-fill-16-9',
});

const { data: block } = useAsyncData(props.uuid, () =>
	$directus.request(
		$readItem('block_card', props.uuid, {
			fields: [
				'id',
				'title',
				'description',
				'image',
				'external_url',
				'icon',
				{ page: ['permalink'], resource: ['type', 'slug', 'title', 'image', { author: ['name'] }] },
			],
		})
	)
);
</script>

<template>
	<BaseCard
		v-if="block"
		:title="block.title ?? block.resource?.title ?? undefined"
		:image="block.image ?? block.resource?.image ?? undefined"
		:icon="block.icon ?? undefined"
		:media-style="mediaStyle"
		:description="block.description ?? block.resource?.author?.name ?? undefined"
		:href="block.external_url ?? block.page?.permalink ?? resourcePermalink(block.resource) ?? undefined"
		:layout="direction"
	/>
</template>
