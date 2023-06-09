<script setup lang="ts">
const props = defineProps({
	imageUrl: { type: String, default: '' },
	title: { type: String, default: '' },
	summary: { type: String, default: '' },
	authorName: { type: String, default: '' },
	authorImage: { type: String, default: '' },
	readTime: { type: String, default: '' },
	badgeLabel: { type: String, default: '' },
	badgeColor: { type: String, default: '' },
});
</script>
<template>
	<div>Template for OG Image</div>
</template>
