<script setup lang="ts">
export interface BaseVideoProps {
	/**
	 * The url of the video.
	 */
	url?: string;

	/**
	 * UUID of a Directus File
	 */
	uuid?: string;

	/**
	 * The title of the video.
	 */
	title?: string;

	autoplay?: boolean;
	controls?: boolean;
	loop?: boolean;
}

const props = withDefaults(defineProps<BaseVideoProps>(), {
	controls: true,
});

const iframeSrc = computed(() => {
	const { url } = props;

	if (!url) return null;

	if (url.includes('youtube.com')) {
		return `https://www.youtube.com/embed/${url.split('v=')[1]}`;
	}

	if (url.includes('youtu.be')) {
		return `https://www.youtube.com/embed/${url.split('be/')[1]}`;
	}

	if (url.includes('vimeo.com')) {
		return `https://player.vimeo.com/video/${url.split('vimeo.com/')[1]}`;
	}

	if (url.includes('loom.com')) {
		return `https://www.loom.com/embed/${url.split('loom.com/share/')[1]}`;
	}

	return null;
});
</script>

<template>
	<BaseDirectusVideo
		v-if="uuid"
		:uuid="uuid"
		class="base-video"
		:autoplay="autoplay"
		:muted="autoplay"
		:controls="controls"
		:loop="loop"
	/>
	<iframe
		v-else-if="iframeSrc"
		class="base-video"
		loading="lazy"
		:src="iframeSrc"
		frameborder="0"
		allow="autoplay; fullscreen; picture-in-picture"
		allowfullscreen
		:title="title"
	/>
</template>

<style lang="scss" scoped>
.base-video {
	width: 100%;
	aspect-ratio: 16 / 9;
}
</style>
