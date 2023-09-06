<script setup lang="ts">
export interface BaseMediaProps {
	aspect?: '16-9' | '4-3' | '3-2' | '1-1' | 'auto' | 'arcade';
	border?: boolean;
	radius?: 'normal' | 'large';
	caption?: string;
}

withDefaults(defineProps<BaseMediaProps>(), { aspect: 'auto', radius: 'normal' });
</script>

<template>
	<figure class="base-media-container">
		<div class="base-media" :class="[`aspect-${aspect}`, `radius-${radius}`, { border }]">
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
	border-radius: var(--rounded-lg);
	overflow: hidden;

	:deep(> :first-child) {
		height: auto;
	}
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
	border: 1px solid color-mix(in srgb, transparent, var(--foreground) 5%);
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

	&.border::after {
		border-radius: var(--rounded-2xl);
	}
}

figure {
	margin: 0;
}

figcaption {
	color: var(--gray-400);
	margin-block-start: var(--space-2);
	font-size: var(--font-size-sm);
	line-height: var(--line-height-sm);
}
</style>
