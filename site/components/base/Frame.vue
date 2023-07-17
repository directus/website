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

const props = defineProps<BaseFrame>();
</script>
<template>
	<div :class="[`aspect-${props.aspect}`, 'base-frame']">
		<slot />
	</div>
</template>
<style>
.base-frame {
	display: flex;
	overflow: hidden;
	width: 100%;
	background: rgba(255, 255, 255, 0.2);
	border-radius: var(--rounded-lg);

	box-shadow: 0px 30px 60px -30px rgba(0, 0, 0, 0.05), 0px 2px 4px 0px rgba(0, 0, 0, 0.05);
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
