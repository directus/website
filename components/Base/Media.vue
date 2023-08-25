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
	radius?: 'normal' | 'large';
	caption?: string;
}

withDefaults(defineProps<BaseMediaProps>(), { aspect: 'auto', radius: 'normal' });
</script>

<template>
	<figure class="base-media-container">
		<div class="base-media" :class="[`aspect-${aspect}`, `radius-${radius}`, { frame, border }]">
			<slot />
		</div>

		<figcaption v-if="caption">{{ caption }}</figcaption>
	</figure>
</template>

<style lang="scss" scoped>
.base-media-container {
	container-type: inline-size;
}

.base-media {
	width: 100%;
	position: relative;

	:deep(> :first-child) {
		border-radius: var(--rounded-lg);
		height: auto;
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

.radius-large {
	:deep(> :first-child) {
		border-radius: var(--rounded-2xl);
	}

	&.frame {
		border-radius: var(--rounded-3xl);
	}

	&.border::after {
		border-radius: var(--rounded-2xl);
	}
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

figure {
	margin: 0;
}

figcaption {
	color: var(--gray-400);
	margin-block-start: var(--space-3);
	font-size: var(--font-size-sm);
	line-height: var(--line-height-sm);
}
</style>
