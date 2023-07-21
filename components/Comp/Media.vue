<script setup lang="ts">
import { CompMedia } from '~~/types';

defineProps<{
	data: CompMedia;
}>();

const { fileUrl } = useFiles();
</script>

<template>
	<BaseFrame variant="frosted" color="white">
		<BaseVideo v-if="data.type === 'video'" :title="data.video?.title" :url="data.video?.url" />
		<img v-else-if="data.type === 'image'" :src="fileUrl(data.image)" :alt="data.image?.alt" />
		<div v-else-if="data.type === 'embed'" v-html="data.embed" />
	</BaseFrame>
</template>
