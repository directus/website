<script setup lang="ts">
const {
	public: { directusUrl },
} = useRuntimeConfig();

export interface DirectusVideoProps {
	/**
	 * Directus File ID
	 */
	uuid: string;

	muted?: boolean;
	autoplay?: boolean;
	controls?: boolean;
	loop?: boolean;
	playsinline?: boolean;
}

const props = defineProps<DirectusVideoProps>();

const src = computed(() => {
	const url = new URL(`/assets/${props.uuid}`, directusUrl);
	return url.toString();
});
</script>

<template>
	<video :src="src" :muted="muted" :autoplay="autoplay" :controls="controls" :loop="loop" :playsinline="playsinline" />
</template>
