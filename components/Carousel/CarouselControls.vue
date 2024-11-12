<script setup lang="ts">
import { useCarousel } from './useCarousel';

const { canScrollPrev, canScrollNext, scrollPrev, scrollNext } = useCarousel();
</script>

<template>
	<div>
		<slot
			:can-scroll-prev="canScrollPrev"
			:can-scroll-next="canScrollNext"
			:on-prev-click="scrollPrev"
			:on-next-click="scrollNext"
		/>
	</div>
</template>
