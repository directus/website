<script setup lang="ts">
export interface BaseMediaProps {
	/**
	 * The aspect ratio of the frame.
	 */
	aspect?: '16-9' | '4-3' | '3-2' | '1-1' | 'auto' | 'arcade';

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

	frame?: boolean;
	border?: boolean;
}

withDefaults(defineProps<BaseMediaProps>(), { aspect: 'auto' });
</script>

<template>
	<div class="base-media-container">
		<div class="base-media" :class="[`aspect-${aspect}`, { frame, border }]">
			<slot />
		</div>
	</div>
</template>

<style lang="scss" scoped>
.base-media-container {
	container-type: inline-size;
}

.base-media {
	width: 100%;

	:deep(> :first-child) {
		border-radius: var(--rounded-lg);
	}
}

.frame {
	border-radius: var(--rounded-xl);
	box-shadow: var(--shadow-base);
	background-color: color-mix(in srgb, transparent, var(--white) 20%);
	backdrop-filter: blur(2px);
	padding: var(--space-2);
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

.border::after {
	position: absolute;
	border: 1px solid color-mix(in srgb, transparent, var(--black) 10%);
	border-radius: var(--rounded-lg);
	inline-size: 100%;
	block-size: 100%;
	inset-block-start: 0;
	inset-inline-start: 0;
	user-select: none;
	pointer-events: none;
	content: '';
}

.frame.border::after {
	inline-size: auto;
	block-size: auto;
	top: var(--space-2);
	left: var(--space-2);
	right: var(--space-2);
	bottom: var(--space-2);
}

.frame .border {
	inline-size: calc(100% - var(--space-2) * 2);
	block-size: calc(100% - var(--space-2) * 2);
	inset-block-start: var(--space-2);
	inset-inline-start: var(--space-2);
}
</style>
