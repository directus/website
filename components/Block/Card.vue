<script setup lang="ts">
import type { BlockProps } from './types';

const { $directus, $readItem } = useNuxtApp();

interface BlockCardProps extends BlockProps {
	direction?: 'vertical' | 'horizontal';
}

const props = withDefaults(defineProps<BlockCardProps>(), {
	direction: 'vertical',
});

const { data: block } = useAsyncData(props.uuid, () =>
	$directus.request(
		$readItem('block_card', props.uuid, {
			fields: [
				'id',
				'title',
				'description',
				'image',
				'image_size',
				'external_url',
				{ page: ['permalink'], resource: ['type', 'slug'] },
			],
		})
	)
);
</script>

<template>
	<BaseCard
		v-if="block"
		:title="block.title ?? undefined"
		:image="block.image ?? undefined"
		:image-size="block.image_size ?? undefined"
		:description="block.description ?? undefined"
		:to="block.external_url ?? block.page?.permalink ?? resourcePermalink(block.resource) ?? undefined"
		:layout="direction"
	/>
</template>
