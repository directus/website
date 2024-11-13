<script setup lang="ts">
import Carousel from '@/components/Carousel/Carousel.vue';
import CarouselControls from '@/components/Carousel/CarouselControls.vue';
import ClassNames from 'embla-carousel-class-names';

const { $directus, $readItem } = useNuxtApp();
const props = defineProps<{ uuid: string }>();
const block = ref<{ cards: Array<{ block_carousel_cards_id: string }> } | null>(null);

const fetchSlides = async () => {
	const result = await $directus.request(
		$readItem('block_carousel', props.uuid, {
			fields: ['id', { cards: ['block_carousel_cards_id'] }],
		}),
	);

	block.value = result as { cards: Array<{ block_carousel_cards_id: string }> };
};

onMounted(async () => {
	await fetchSlides();
});
</script>

<template>
	<div v-if="block" class="embla">
		<Carousel
			v-slot="{ current }"
			:opts="{
				loop: true,
			}"
			:plugins="[ClassNames({ snapped: 'slide--selected' })]"
		>
			<CarouselContent class="embla__container">
				<CarouselItem v-for="(card, index) in block.cards" :key="card.block_carousel_cards_id" class="embla__slide">
					<BlockCarouselCard :uuid="card.block_carousel_cards_id" :is-focused="current.value === index + 1" />
				</CarouselItem>
			</CarouselContent>
			<CarouselControls v-slot="{ scrollPrev, scrollNext }">
				<div class="embla__controls">
					<BaseButton
						color="secondary"
						outline
						class="embla__button embla__button--prev"
						size="large"
						icon="arrow_back"
						icon-position="right"
						aria-label="Previous slide"
						@click="scrollPrev"
					/>
					<BaseButton
						color="secondary"
						outline
						class="embla__button embla__button--next"
						size="large"
						icon="arrow_forward"
						icon-position="right"
						aria-label="Next slide"
						@click="scrollNext"
					/>
				</div>
			</CarouselControls>
		</Carousel>
	</div>
</template>

<style lang="scss" scoped>
.embla {
	margin: auto;
	position: relative;
	overflow: hidden;
	padding: 50px 0;
	height: 100%;
	--slide-spacing: 60px;
	--slide-size: 30%;

	&:focus-within {
		outline: none;
	}
	&__container {
		display: flex;
		touch-action: pan-y pinch-zoom;
		margin-left: calc(var(--slide-spacing) * -1);
	}
	&__slide {
		position: relative;
		transform: translate3d(0, 0, 0);
		flex: 0 0 var(--slide-size);
		min-width: 0;
		flex-shrink: 0;
		flex-grow: 0;
		padding-left: var(--slide-spacing);
		& > * {
			opacity: 0.25;
			transform-origin: center;
			transition:
				opacity 0.3s ease-in-out,
				transform 0.3s ease-in-out;
		}
		&.slide--selected > * {
			opacity: 1;
			transform: scale(1.2);
		}
	}
	&__controls {
		position: relative;
		justify-content: center;
		left: 0;
		right: 0;
		display: flex;
		gap: 30%;
		bottom: 80px;
		top: auto;
		@media (max-width: 1704px) {
			bottom: 60px;
			top: auto;
		}
		@media (max-width: 847px) {
			bottom: 40px;
			top: auto;
		}
		@media (max-width: 768px) {
			top: auto;
			bottom: 20px;
			gap: 60%;
		}
	}

	&__button {
		z-index: 10;
		color: #333;
		padding: 8px;
		&__svg {
			width: 24px;
			height: 24px;
		}
	}
}
@media (max-width: 768px) {
	.embla {
		--slide-size: 100%;
		--slide-spacing: 4px;

		&__slide {
			flex: 0 0 var(--slide-size);
			padding-left: var(--slide-spacing);
		}
	}
}
</style>
