import { createInjectionState } from '@vueuse/core';
import emblaCarouselVue from 'embla-carousel-vue';
import { onMounted, ref } from 'vue';
import type { UnwrapRefCarouselApi as CarouselApi, CarouselEmits, CarouselProps } from './interface';
import { watchOnce } from '@vueuse/core';

const [useProvideCarousel, useInjectCarousel] = createInjectionState(
	({ opts, orientation, plugins }: CarouselProps, emits: CarouselEmits) => {
		const [emblaNode, emblaApi] = emblaCarouselVue(
			{
				...opts,
				axis: orientation === 'horizontal' ? 'x' : 'y',
			},
			plugins,
		);

		function scrollPrev() {
			emblaApi.value?.scrollPrev();
		}

		function scrollNext() {
			emblaApi.value?.scrollNext();
		}

		const canScrollNext = ref(false);
		const canScrollPrev = ref(false);

		function onSelect(api: CarouselApi) {
			canScrollNext.value = api?.canScrollNext() || false;
			canScrollPrev.value = api?.canScrollPrev() || false;
		}

		const totalCount = ref(0);
		const current = ref(0);

		onMounted(() => {
			if (!emblaApi.value) return;

			emblaApi.value?.on('init', onSelect);
			emblaApi.value?.on('reInit', onSelect);
			emblaApi.value?.on('select', onSelect);

			emits('init-api', emblaApi.value);
		});

		watchOnce(emblaApi, (api) => {
			if (!api) return;

			totalCount.value = api.scrollSnapList().length;
			current.value = api.selectedScrollSnap() + 1;

			api.on('select', () => {
				current.value = api.selectedScrollSnap() + 1;
			});
		});

		return {
			carouselRef: emblaNode,
			carouselApi: emblaApi,
			canScrollPrev,
			canScrollNext,
			scrollPrev,
			scrollNext,
			orientation,
			current,
			totalCount,
		};
	},
);

function useCarousel() {
	const carouselState = useInjectCarousel();

	if (!carouselState) throw new Error('useCarousel must be used within a <Carousel />');

	return carouselState;
}

export { useCarousel, useProvideCarousel };
