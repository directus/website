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
			:opts="{
				loop: true,
			}"
			:plugins="[ClassNames({ snapped: 'slide--selected' })]"
		>
			<CarouselContent class="embla__container">
				<CarouselItem v-for="card in block.cards" :key="card.block_carousel_cards_id" class="embla__slide">
					<BlockCarouselCard :uuid="card.block_carousel_cards_id" />
				</CarouselItem>
			</CarouselContent>
			<CarouselControls v-slot="{ onPrevClick, onNextClick }">
				<div class="embla__controls">
					<BaseButton
						color="secondary"
						outline
						class="embla__button embla__button--prev"
						size="large"
						icon="arrow_back"
						icon-position="right"
						aria-label="Previous slide"
						@click="onPrevClick"
					/>
					<BaseButton
						color="secondary"
						outline
						class="embla__button embla__button--next"
						size="large"
						icon="arrow_forward"
						icon-position="right"
						aria-label="Next slide"
						@click="onNextClick"
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

	--slide-spacing: 40px;
	--slide-size: 40%;

	&__container {
		display: flex;
		touch-action: pan-y pinch-zoom;
		// margin-left: calc(var(--slide-spacing) * -1);
	}

	&__slide {
		position: relative;
		transition-property: opacity, scale;
		transition-timing-function: ease-in;
		transition-duration: 0.5s;
		transform: translate3d(0, 0, 0);
		// width: 50%;
		flex: 0 0 var(--slide-size);
		// min-width: 0;
		flex-shrink: 0;
		flex-grow: 0;
		// flex-basis: 40%;
		// padding-left: var(--slide-spacing);
		opacity: 0.5;
		// scale: 0.9;

		&.slide--selected {
			opacity: 1;
			// scale: 1.1;
		}
	}
	&__controls {
		display: flex;
		justify-content: center;
		gap: 200px;
		margin-top: -100px;
	}
	&__button {
		background-color: transparent;
		z-index: 10;
		color: #333;
		padding: 8px;

		&__svg {
			width: 24px;
			height: 24px;
		}
	}
}
</style>
