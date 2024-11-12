<script setup lang="ts">
import type { BlockProps } from '../types';

const { $directus, $readItem } = useNuxtApp();

interface CarouselCardProps extends BlockProps {
	uuid: string;
	isFocused?: boolean;
}

const props = defineProps<CarouselCardProps>();

const { data: cardData } = useAsyncData(`carousel-card-${props.uuid}`, () =>
	$directus.request(
		$readItem('block_carousel_cards', props.uuid, {
			fields: [
				'id',
				'type',
				'title',
				'image',
				'external_url',
				'button_text',
				{ page: ['permalink'] },
				{ resource: ['slug'] },
			],
		}),
	),
);

const buttonHref = computed(() => {
	if (cardData.value?.external_url) {
		return cardData.value.external_url;
	}

	if (cardData.value?.page?.permalink) {
		return cardData.value.page.permalink;
	}

	if (cardData.value?.resource?.slug) {
		return `/resource/${cardData.value.resource.slug}`;
	}

	return '#';
});
</script>

<template>
	<div :class="['carousel-card-content', { 'carousel-card--focused': props.isFocused }]">
		<BaseDirectusImage v-if="cardData?.image" :uuid="cardData?.image as string" :alt="cardData?.title ?? ''" />
		<Transition name="fade">
			<div v-show="props.isFocused">
				<h2 class="title">{{ cardData?.title }}</h2>
				<BaseButton
					v-show="props.isFocused"
					:href="buttonHref"
					:label="cardData?.button_text"
					color="secondary"
					class="custom-button"
					size="medium"
					icon="arrow_forward"
					icon-position="right"
				/>
			</div>
		</Transition>
	</div>
</template>

<style lang="scss" scoped>
.carousel-card-content {
	max-width: 100%;
	border-radius: 12px;
	text-align: center;
	display: flex;
	flex-direction: column;
	align-items: center;

	img {
		border-radius: 8px;
		margin-bottom: 12px;
	}

	h2 {
		font-style: normal;
		font-family: var(--family-display);
		background: linear-gradient(143deg, var(--primary-500) 0%, var(--secondary) 100%);
		background-clip: text;
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		position: relative;
		z-index: 1;
		max-width: 20ch;
		word-wrap: break-word;
		line-height: 1.4;
	}

	.custom-button {
		color: black;
		background: none;
		border: none;
		box-shadow: none;
		padding: 8px 16px;
		margin-top: 12px;
		border-radius: 6px;
		padding-left: 24px;
		cursor: pointer;
	}
}

.fade-enter-active,
.fade-leave-active {
	transition: opacity 0.3s ease-in-out;
}

.fade-enter-from,
.fade-leave-to {
	opacity: 0;
}
</style>
