<script setup lang="ts">
import { BlockMediaFullwidth } from '~~/types';

const props = defineProps<{
	data: BlockMediaFullwidth;
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
