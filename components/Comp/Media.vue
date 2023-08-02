<script setup lang="ts">
import type { CompProps } from './types';

const { $directus, $readItem } = useNuxtApp();

const props = defineProps<CompProps>();

const { data: comp } = useAsyncData(props.uuid, () =>
	$directus.request(
		$readItem('comp_media', props.uuid, {
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
</script>

<template>
	<BaseFrame variant="frosted" color="white">
		<BaseVideo v-if="comp?.type === 'video' && comp.video?.url" :url="comp.video.url" />
		<BaseDirectusImage
			v-else-if="comp?.type === 'image' && comp.image"
			:uuid="comp.image.id"
			:alt="comp.image.description ?? ''"
		/>
		<!-- eslint-disable-next-line vue/no-v-html -->
		<div v-else-if="comp?.type === 'embed'" v-html="comp.embed" />
	</BaseFrame>
</template>
