<script setup lang="ts">
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

defineProps<DirectusImageProps>();
</script>

<template>
	<NuxtImg :src="uuid" :alt="alt" :width="width" :height="height" format="auto" loading="lazy" />
</template>
