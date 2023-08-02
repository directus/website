<script setup lang="ts">
import type { BlockProps } from './types';

const { $directus, $readItem } = useNuxtApp();

const props = defineProps<BlockProps>();

const { data: block } = useAsyncData(props.uuid, () =>
	$directus.request(
		$readItem('block_media_fullwidth', props.uuid, {
			fields: ['type', 'embed', { video: ['url'], image: ['id', 'title'] }],
		})
	)
);

const imgSrc = computed(() => {
	const type = unref(block)?.type;
	const imageId = unref(block)?.image?.id;
	if (type !== 'image' || !imageId) return null;

	return imageId;
});
</script>

<template>
	<BaseFrame v-if="block" aspect="16-9" variant="frosted" color="white">
		<BaseVideo v-if="block.type === 'video' && block.video" :url="block.video.url!" />
		<BaseImg
			v-else-if="block.type === 'image' && block.image"
			:src="imgSrc!"
			:alt="block.image.title"
			sizes="450px:circle 800px:page"
		/>
		<!-- eslint-disable-next-line vue/no-v-html -->
		<div v-else-if="block.type === 'embed' && block.embed" v-html="block.embed" />
	</BaseFrame>
</template>

<style scoped></style>
