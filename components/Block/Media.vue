<script setup lang="ts">
import type { BlockProps } from './types';

const { $directus, $readItem } = useNuxtApp();

const props = defineProps<BlockProps>();

const { data: block } = useAsyncData(props.uuid, () =>
	$directus.request(
		$readItem('block_media', props.uuid, {
			fields: [
				'type',
				'embed',
				'aspect_ratio',
				'frame',
				'border',
				'arcade_url',
				'external_image_url',
				'border_radius',
				'caption',
				{ video: ['url', 'autoplay', 'controls', 'loop', { file: ['id'] }], image: ['id', 'description'] },
			],
		})
	)
);
</script>

<template>
	<BaseMedia
		v-if="block"
		class="block-media"
		:aspect="block.type === 'arcade' ? 'auto' : block.aspect_ratio ?? undefined"
		:frame="block.frame"
		:border="block.border"
		:radius="block.border_radius"
		:caption="block.caption ?? undefined"
	>
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
			class="arcade media"
			:src="block.arcade_url"
			allowfullscreen
		/>

		<img v-else-if="block.external_image_url" class="media" :src="block.external_image_url" alt="" loading="lazy" />
	</BaseMedia>
</template>

<style lang="scss" scoped>
.media {
	width: 100%;
	height: auto;
	object-fit: cover;
	object-position: top;
}

.arcade {
	border: none;
	margin: 0;
	padding: 0;
	width: 100%;
	position: relative;
	display: block;
	aspect-ratio: 16 / 9;
}
</style>
