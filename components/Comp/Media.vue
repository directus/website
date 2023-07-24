<script setup lang="ts">
import { readItem } from '@directus/sdk';
import type { CompProps } from './types';

const { $directus } = useNuxtApp();

const props = defineProps<CompProps>();

const { data: comp } = useAsyncData(props.uuid, () =>
	$directus.request(
		readItem('comp_media', props.uuid, {
			fields: [
				'type',
				'embed',
				{
					video: ['url'],
					image: ['id', 'description'],
				},
			],
		})
	)
);

const imageUrl = computed(() => getFileUrl(unref(comp)?.image.id));
</script>

<template>
	<BaseFrame variant="frosted" color="white">
		<BaseVideo v-if="comp?.type === 'video' && comp.video.url" :url="comp.video.url" />
		<img v-else-if="comp?.type === 'image' && comp.image" :src="imageUrl" :alt="comp.image.description ?? undefined" />
		<!-- eslint-disable-next-line vue/no-v-html -->
		<div v-else-if="comp?.type === 'embed'" v-html="comp.embed" />
	</BaseFrame>
</template>
