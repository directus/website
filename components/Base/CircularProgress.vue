<script setup lang="ts">
export interface BaseCircularProgressProps {
	percentage: number;
}

const props = defineProps<BaseCircularProgressProps>();

const offset = computed(() => -51 - (51 / 100) * props.percentage);

const transitionDuration = computed(() => (props.percentage === 0 ? '0ms' : '1000ms'));
</script>

<template>
	<svg class="circular-progress" viewBox="0 0 20 20">
		<circle class="track" cx="10" cy="10" r="8" />
		<circle class="progress" cx="10" cy="10" r="8" />
	</svg>
</template>

<style scoped lang="scss">
.circular-progress {
	width: var(--space-5);
}

.track {
	fill: none;
	stroke: var(--gray-200);
	stroke-width: 4;
}

.progress {
	fill: none;
	stroke: var(--black);
	stroke-width: 4;
	stroke-dasharray: 51 51;
	stroke-dashoffset: v-bind(offset);
	stroke-linecap: round;
	transition-property: stroke-dashoffset;
	transition-duration: v-bind(transitionDuration);
	transition-timing-function: linear;
	rotate: -90deg;
	transform-origin: center center;
}
</style>
