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
	<div
		:class="['carousel-card-content', { 'carousel-card--focused': props.isFocused }]"
		:style="{ opacity: props.isFocused ? '1' : '0.3' }"
	>
		<BaseDirectusImage v-if="cardData?.image" :uuid="cardData?.image as string" :alt="cardData?.title ?? ''" />
		<h2 class="title">{{ cardData?.title }}</h2>

		<BaseButton
			v-if="cardData?.button_text && props.isFocused"
			:href="buttonHref"
			:label="cardData.button_text"
			color="secondary"
			:outline="false"
			class="custom-button"
			size="medium"
			icon="arrow_forward"
			icon-position="right"
		/>
	</div>
</template>

<style lang="scss" scoped>
.carousel-card-content {
	background-color: #ffffff;
	border-radius: 12px;
	box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
	overflow: hidden;
	max-width: 300px;
	text-align: center;
	display: flex;
	flex-direction: column;
	align-items: center;
	padding-bottom: 16px;
	margin-bottom: 32px;

	transition:
		transform 0.3s,
		opacity 0.3s ease;

	&.carousel-card--focused {
		transform: scale(1);
	}

	img {
		border-radius: 8px;
		margin-bottom: 12px;
	}

	h2 {
		font-style: normal;
		background: linear-gradient(143deg, var(--primary-500) 0%, var(--secondary) 100%);
		background-clip: text;
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		position: relative;
		z-index: 1;
		max-width: 200px;
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
</style>
