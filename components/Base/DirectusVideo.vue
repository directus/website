<script setup lang="ts">
const {
	public: { directusUrl, directusToken },
} = useRuntimeConfig();

export interface DirectusImageProps {
	/**
	 * Directus File ID
	 */
	uuid: string;
}

const props = defineProps<DirectusImageProps>();

const src = computed(() => {
	const url = new URL(`/assets/${props.uuid}`, directusUrl);
	url.searchParams.set('token', directusToken);
	return url.toString();
});
</script>

<template>
	<video :src="src" />
</template>
