<script setup lang="ts">
import type { BlockProps } from './types';

const { $directus, $readItem } = useNuxtApp();

const props = defineProps<BlockProps>();

const { data: block } = useAsyncData(props.uuid, () =>
	$directus.request(
		$readItem('block_media', props.uuid, {
			fields: ['type', 'embed', 'aspect_ratio', { video: ['url'], image: ['id', 'description'] }],
		})
	)
);
</script>

<template>
	<BaseFrame v-if="block" class="block-media" :aspect="block.aspect_ratio ?? undefined" variant="frosted" color="white">
		<BaseVideo v-if="block.type === 'video' && block.video" :url="block.video.url!" />

		<BaseDirectusImage
			v-else-if="block.type === 'image' && block.image"
			:uuid="block.image.id"
			:alt="block.image.description!"
		/>

		<!-- eslint-disable-next-line vue/no-v-html -->
		<div v-else-if="block.type === 'embed' && block.embed" v-html="block.embed" />
	</BaseFrame>
</template>

<style lang="scss" scoped>
.block-media {
	> * {
		width: 100%;
		height: auto;
		object-fit: cover;
		object-position: top;
		border: 1px solid var(--gray-100);
	}
}
</style>
