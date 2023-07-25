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
	if (unref(block)?.type !== 'image') return null;
	return getFileUrl(unref(block)!.image.id);
});
</script>

<template>
	<BaseFrame v-if="block" aspect="16-9" variant="frosted" color="white">
		<BaseVideo v-if="block.type === 'video' && block.video" :url="block.video.url!" />
		<img v-else-if="block.type === 'image' && block.image" :src="imgSrc!" :alt="block.image.title" />
		<!-- eslint-disable-next-line vue/no-v-html -->
		<div v-else-if="block.type === 'embed' && block.embed" v-html="block.embed" />
	</BaseFrame>
</template>

<style scoped></style>
