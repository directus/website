<script setup lang="ts">
import { BlockMediaFullWidth } from '~~/types/schema';

const props = defineProps<{
	data: BlockMediaFullWidth;
}>();
</script>

<template>
	<BaseFrame aspect="16-9" variant="frosted" color="white">
		<BaseVideo v-if="data.type === 'video'" :title="data.video?.title" :url="data.video?.url" />
		<img v-else-if="data.type === 'image'" :src="data.image?.url" :alt="data.image?.alt" />
		<div v-else-if="data.type === 'embed'" v-html="data.embed" />
	</BaseFrame>
</template>

<style scoped></style>
