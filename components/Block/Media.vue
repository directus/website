<script setup lang="ts">
import type { BlockProps } from './types';

const { $directus, $readItem } = useNuxtApp();

const props = defineProps<BlockProps>();

const { data: block } = useAsyncData(props.uuid, () =>
	$directus.request(
		$readItem('block_media', props.uuid, {
			fields: [
				'type',
				'aspect_ratio',
				'arcade_url',
				'frame',
				{ video: ['url', 'autoplay', 'controls', 'loop', { file: ['id'] }], image: ['id', 'description'] },
			],
		})
	)
);
</script>

<template>
	<BaseMedia v-if="block" class="block-media" :aspect="block.aspect_ratio ?? undefined" :frame="block.frame">
		<BaseVideo
			v-if="block.type === 'video' && block.video"
			class="media"
			:url="block.video.url ?? undefined"
			:uuid="block.video.file?.id ?? undefined"
			:autoplay="block.video.autoplay"
			:loop="block.video.loop"
			:controls="block.video.controls"
		/>

		<BaseDirectusImage
			v-else-if="block.type === 'image' && block.image"
			class="media"
			:uuid="block.image.id"
			:alt="block.image.description!"
		/>

		<iframe
			v-else-if="block.type === 'arcade' && block.arcade_url"
			:src="block.arcade_url"
			class="media arcade"
			frameborder="0"
			loading="lazy"
			webkitallowfullscreen
			mozallowfullscreen
			allowfullscreen
		/>
	</BaseMedia>
</template>

<style lang="scss" scoped>
.media {
	width: 100%;
	height: auto;
	object-fit: cover;
	object-position: top;

	&.arcade {
		height: 100%;
	}
}
</style>
