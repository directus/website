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
				'border',
				'arcade_url',
				'arcade_fallback_video',
				'external_image_url',
				'border_radius',
				'caption',
				{ video: ['url', 'autoplay', 'controls', 'loop', { file: ['id'] }], image: ['id', 'description'] },
			],
		}),
	),
);
</script>

<template>
	<BaseMedia
		v-if="block"
		class="block-media"
		:aspect="block.type === 'arcade' || block.type === 'iframe' ? 'auto' : (block.aspect_ratio ?? undefined)"
		:border="block.border"
		:radius="block.border_radius"
		:caption="block.caption ?? undefined"
	>
		<BaseVideo
			v-if="block.type === 'video' && block.video"
			class="media video"
			:url="block.video.url ?? undefined"
			:uuid="block.video.file?.id ?? undefined"
			:autoplay="block.video.autoplay"
			:loop="block.video.loop"
			:controls="block.video.controls"
		/>

		<BaseDirectusImage
			v-else-if="block.type === 'image' && block.image"
			class="media"
			:width="1184"
			:uuid="block.image.id as string"
			:alt="block.image.description ?? ''"
		/>

		<template v-else-if="block.type === 'arcade' && block.arcade_url">
			<iframe class="arcade media" :src="block.arcade_url" allowfullscreen loading="lazy" />
			<BaseDirectusVideo
				v-if="block.arcade_fallback_video"
				class="media fallback"
				:uuid="block.arcade_fallback_video as string"
				:autoplay="true"
				:loop="true"
				:controls="true"
				:playsinline="true"
			/>
		</template>

		<div v-else-if="block.type === 'iframe' && block.embed" v-html="block.embed" class="iframe" />

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

.video {
	display: block;
}

.arcade {
	border: none;
	margin: 0;
	padding: 0;
	width: 100%;
	position: relative;
	display: none;
	aspect-ratio: 16 / 9;

	@container (width > 30rem) {
		display: block;
	}
}

.fallback {
	border: none;
	position: relative;
	aspect-ratio: 16 / 9;
	display: block;

	@container (width > 30rem) {
		display: none;
	}
}

.iframe {
	aspect-ratio: 9 / 16;
	iframe {
		width: 100%;
		height: 100%;
	}
	@container (width > 30rem) {
		width: 100%;
		aspect-ratio: 16 / 10;
		max-height: 450px;
	}
}
</style>
