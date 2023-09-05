<script setup lang="ts">
const { params } = useRoute();
const slug = computed(() => params.slug as string);
</script>

<template>
	<TeamPage :slug="slug" />
</template>
