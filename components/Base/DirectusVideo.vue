<script setup lang="ts">
const {
	public: { directusUrl },
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
	return url.toString();
});
</script>

<template>
	<video :src="src" />
</template>
