<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import emblaCarouselVue from 'embla-carousel-vue';
import type { EmblaCarouselType } from 'embla-carousel';
import CarouselCard from './CarouselCard.vue';

const { $directus, $readItem } = useNuxtApp();
const props = defineProps<{ uuid: string }>();

const [emblaRef, emblaApi] = emblaCarouselVue({ loop: true });
const block = ref<{ cards: Array<{ block_carousel_cards_id: string }> } | null>(null);
const currentIndex = ref(0);

const fetchSlides = async () => {
	const result = await $directus.request(
		$readItem('block_carousel', props.uuid, {
			fields: ['id', { cards: ['block_carousel_cards_id'] }],
		}),
	);

	block.value = result as { cards: Array<{ block_carousel_cards_id: string }> };
};

const visibleSlides = computed(() => {
	if (!block.value) return [];
	const startIndex = currentIndex.value;
	return block.value.cards.slice(startIndex, startIndex + 5);
});

const onNextClick = () => {
	if (!block.value) return;
	currentIndex.value = (currentIndex.value + 1) % block.value.cards.length;
	updateSlideOpacity();
};

const onPrevClick = () => {
	if (!block.value) return;
	currentIndex.value = (currentIndex.value - 1 + block.value.cards.length) % block.value.cards.length;
	updateSlideOpacity();
};

const updateSlideOpacity = () => {
	if (!emblaApi.value) return;

	const emblaSlides = emblaApi.value.slideNodes();
	const slidesInView = emblaApi.value.slidesInView();

	emblaSlides.forEach((slide, index) => {
		slide.style.opacity = slidesInView.includes(index) ? '1' : '0.3';
	});
};

onMounted(async () => {
	await fetchSlides();

	if (emblaApi.value) {
		emblaApi.value.on('scroll', updateSlideOpacity);
		emblaApi.value.on('reInit', updateSlideOpacity);
		updateSlideOpacity();
	}
});
</script>

<template>
	<div v-if="block" ref="emblaRef" class="embla">
		<div class="embla__viewport">
			<div class="embla__container">
				<CarouselCard
					v-for="(card, index) in visibleSlides"
					:key="card.block_carousel_cards_id"
					:uuid="card.block_carousel_cards_id"
					:is-focused="index === 2"
					class="embla__slide"
				/>
			</div>
		</div>
		<div class="embla__controls">
			<BaseButton
				color="secondary"
				outline
				class="embla__button embla__button--prev"
				size="medium"
				icon="arrow_back"
				icon-position="right"
				aria-label="Toggle navigation"
				@click="onPrevClick"
			/>
			<BaseButton
				color="secondary"
				outline
				class="embla__button embla__button--next"
				size="medium"
				icon="arrow_forward"
				icon-position="right"
				aria-label="Toggle navigation"
				@click="onNextClick"
			/>
		</div>
	</div>
</template>

<style lang="scss" scoped>
.embla {
	margin: auto;
	--slide-spacing: 40px;
	--slide-size: 20%;

	&__container {
		display: flex;
		touch-action: pan-y pinch-zoom;
		margin-left: calc(var(--slide-spacing) * -1);
	}

	&__slide {
		transform: translate3d(0, 0, 0);
		flex: 0 0 var(--slide-size);
		min-width: 0;
		padding-left: var(--slide-spacing);
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
