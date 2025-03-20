<script setup lang="ts">
import Carousel from '@/components/Carousel/Carousel.vue';
import CarouselControls from '@/components/Carousel/CarouselControls.vue';
import ClassNames from 'embla-carousel-class-names';
import CarouselDots from '~/components/Carousel/CarouselDots.vue';

const props = defineProps<{ uuid: string }>();

const { $directus, $readItem } = useNuxtApp();

const { data: block } = useAsyncData(`carousel-${props.uuid}`, () =>
	$directus.request(
		$readItem('block_carousel', props.uuid, {
			fields: ['id', { cards: ['block_carousel_cards_id'] }],
		}),
	));
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
					<CarouselDots />
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

	&:focus,
	&:focus-within,
	&:focus-visible {
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
			transition: opacity 0.3s ease-in-out, transform 0.3s ease-in-out;
		}
		&.slide--selected > * {
			opacity: 1;
			transform: scale(1.2);
			margin-left: var(--space-4);
			margin-right: var(--space-4);
		}
	}
	&__controls {
		display: flex;
		justify-content: center;
		gap: var(--space-16);
		margin-top: var(--space-16);
		align-items: center;
	}

	&__button {
		padding: var(--space-2);
		&__svg {
			width: 24px;
			height: 24px;
		}
	}
}
@media (max-width: 768px) {
	.embla {
		--slide-size: 100%;
		--slide-spacing: var(--space-1);

		&__slide {
			flex: 0 0 var(--slide-size);
			padding-left: var(--slide-spacing);
		}
	}
}

@media (min-width: 1200px) {
	.embla__slide {
		padding-left: calc(var(--slide-spacing) + 20px);
	}

	.embla__slide.slide--selected {
		> * {
			margin-left: var(--space-8);
			margin-right: var(--space-8);
		}
	}
}
</style>
