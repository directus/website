<script setup lang="ts">
import { useCarousel } from './useCarousel';
import type { WithClassAsProps } from './interface';

defineOptions({
	inheritAttrs: false,
});

const props = defineProps<WithClassAsProps>();

const { carouselRef, orientation } = useCarousel();
</script>

<template>
	<div ref="carouselRef" class="carousel-container">
		<div
			:class="['carousel-content', orientation === 'horizontal' ? 'horizontal' : 'vertical', props.class]"
			v-bind="$attrs"
		>
			<slot />
		</div>
	</div>
</template>

<style scoped>
.carousel-container {
	/* overflow: hidden; */
}

.carousel-content {
	display: flex;
}

.carousel-content.horizontal {
	margin-left: -4rem;
}

.carousel-content.vertical {
	margin-top: -1rem;
	flex-direction: column;
}

.scene {
	--buff: 3rem;
	height: 100%;
	width: 100%;
	mask: linear-gradient(to right, transparent, white var(--buff) calc(100% - var(--buff)), transparent),
		linear-gradient(to left, transparent, white var(--buff) calc(100% - var(--buff)), transparent);
	mask-composite: intersect;
}

@media (max-width: 768px) {
	.carousel-content.horizontal {
		margin-left: 0;
	}
}
</style>
