<script setup lang="ts">
export interface BaseFrame {
	/**
	 * The aspect ratio of the frame.
	 */
	aspect?: '16-9' | '4-3' | '1-1';

	/**
	 * The alignment of the frame.
	 */
	align?: 'start' | 'center' | 'end';

	/**
	 * The background color of the frame.
	 */
	color?: 'white' | 'gray';

	/**
	 * The style of the frame.
	 */
	variant?: 'solid' | 'frosted';
}

defineProps<BaseFrame>();
</script>

<template>
	<div :class="[`aspect-${aspect}`, 'base-frame']">
		<slot />
	</div>
</template>

<style scoped>
.base-frame {
	display: flex;
	overflow: hidden;
	width: 100%;
	background: rgba(255, 255, 255, 0.2);
	border-radius: var(--rounded-lg);

	box-shadow: var(--shadow-base);
	backdrop-filter: blur(2px);

	padding: var(--space-4);
}

.aspect-16-9 {
	aspect-ratio: 16 / 9;
}

.aspect-4-3 {
	aspect-ratio: 4 / 3;
}

.aspect-1-1 {
	aspect-ratio: 1 / 1;
}
</style>
