<script setup lang="ts">
import { BlockFeaturegrid } from '~~/types';

defineProps<{
	data: BlockFeaturegrid;
}>();
</script>

<template>
	<div class="feature-grid">
		<div v-for="(feature, featureIdx) in data.features" :key="featureIdx">
			<BaseHeading size="small" font="body" :icon="feature.icon" :content="feature.title" />
			<BaseText :content="feature.description" />
		</div>
	</div>
</template>

<style scoped>
.feature-grid {
	display: grid;
	grid-template-columns: repeat(3, 1fr);
	grid-gap: 1rem;
}
</style>
