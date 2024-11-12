<script setup lang="ts">
import { useCarousel } from './useCarousel';

const { canScrollPrev, canScrollNext, scrollPrev, scrollNext } = useCarousel();
</script>

<template>
	<div>
		<slot v-bind="{ canScrollPrev, canScrollNext, scrollPrev, scrollNext }" />
	</div>
</template>
