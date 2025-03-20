<script setup lang="ts">
const { params } = useRoute();
const slug = computed(() => params.slug as string);

definePageMeta({
	path: '/blog/:slug',
});
</script>

<template>
	<ResourcePage :slug="slug" type="blog" />
</template>
