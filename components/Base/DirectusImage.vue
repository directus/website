<script setup lang="ts">
const {
	public: { directusUrl },
} = useRuntimeConfig();

export interface DirectusImageProps {
	/**
	 * Directus File ID
	 */
	uuid: string;

	/**
	 * Alt text for image
	 */
	alt: string;

	width?: number;
	height?: number;
}

const props = defineProps<DirectusImageProps>();

// const { pixelRatio } = useDevicePixelRatio();

// const src = computed(() => {
// 	const url = new URL(`/assets/${props.uuid}`, directusUrl);

// 	url.searchParams.set('format', 'auto');

// 	// url.searchParams.set('quality', '100');

// 	if (props.width) {
// 		url.searchParams.set('width', String(Math.round(props.width * unref(pixelRatio))));
// 	}

// 	if (props.height) {
// 		url.searchParams.set('height', String(Math.round(props.height * unref(pixelRatio))));
// 	}

// 	return url.toString();
// });
</script>

<template>
	<NuxtImg :src="uuid" :alt="alt" :width="width" :height="height" format="auto" loading="lazy" />
</template>
