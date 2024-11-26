<script setup lang="ts">
import { useCarousel } from './useCarousel';

const { scrollTo, selectedIndex, scrollSnaps } = useCarousel();
</script>

<template>
	<div class="carousel__dots">
		<button
			v-for="(snap, index) in scrollSnaps"
			:key="index"
			class="carousel__dot"
			:class="{ 'carousel__dot--active': index === selectedIndex }"
			aria-label="'Go to slide ' + (index + 1)"
			@click="scrollTo(index)"
		></button>
	</div>
</template>

<style lang="scss" scoped>
.carousel__dots {
	display: flex;
	gap: 8px;
}

.carousel__dot {
	width: 10px;
	height: 10px;
	background-color: #f1f3f7;
	border: none;
	border-radius: 50%;
	cursor: pointer;
	transition: background-color 0.3s;
}

.carousel__dot--active {
	background-color: #42566e;
}
</style>
