<script setup lang="ts">
const { params } = useRoute();
const slug = computed(() => params.slug as string);

definePageMeta({
	path: `/videos/:slug`,
});
</script>

<template>
	<ResourcePage :slug="slug" type="videos" />
</template>
