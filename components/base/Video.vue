<script setup lang="ts">
export interface BaseVideoProps {
	/**
	 * The title of the video.
	 */
	title: string;

	/**
	 * The url of the video.
	 */
	url: string;
}

defineProps<BaseVideoProps>();

function generateVideoEmbed(url: string) {
	if (url.includes('youtube.com')) {
		return `https://www.youtube.com/embed/${url.split('v=')[1]}`;
	}
	// Handle youtu.be links
	else if (url.includes('youtu.be')) {
		return `https://www.youtube.com/embed/${url.split('be/')[1]}`;
	} else if (url.includes('vimeo.com')) {
		return `https://player.vimeo.com/video/${url.split('vimeo.com/')[1]}`;
	} else if (url.includes('loom.com')) {
		return `https://www.loom.com/embed/${url.split('loom.com/share/')[1]}`;
	} else {
		return url;
	}
}
</script>

<template>
	<iframe
		class="base-video"
		loading="lazy"
		:src="generateVideoEmbed(url)"
		frameborder="0"
		allow="autoplay; fullscreen; picture-in-picture"
		allowfullscreen
		:title="title"
	></iframe>
</template>

<style>
.base-video {
	width: 100%;
	aspect-ratio: 16 / 9;
}
</style>
