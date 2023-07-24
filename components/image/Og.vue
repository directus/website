<script setup lang="ts">
interface OgProps {
	title: string;
	imageUrl?: string;
	summary?: string;
	authorName?: string;
	authorImage?: string;
	readTime?: string;
	badgeLabel?: string;
	badgeColor?: string;
}

defineProps<OgProps>();
</script>
<template>
	<div>Template for OG Image</div>
</template>
