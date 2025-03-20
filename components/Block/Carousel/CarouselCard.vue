<script setup lang="ts">
import type { BlockProps } from '../types';

const props = defineProps<CarouselCardProps>();
const { $directus, $readItem } = useNuxtApp();
interface CarouselCardProps extends BlockProps {
	uuid: string;
	isFocused?: boolean;
}
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
				'description',
				{ block_button_group: ['id', 'alignment'] },
				{ page: ['permalink'] },
				{ resource: ['slug'] },
			],
		}),
	));
</script>

<template>
	<div class="carousel-card-content" :class="[{ 'carousel-card--focused': props.isFocused }]">
		<BaseDirectusImage v-if="cardData?.image" :uuid="cardData?.image as string" :alt="cardData?.title ?? ''" />
		<div class="content-container">
			<div class="card-content" :class="{ 'is-hidden': !props.isFocused }">
				<h2 class="title">
					{{ cardData?.title }}
				</h2>
				<p v-if="cardData?.description" class="description">
					{{ cardData?.description }}
				</p>
				<div class="button-container">
					<BlockButtonGroup
						v-if="cardData?.block_button_group"
						class="custom-button-group"
						:uuid="cardData?.block_button_group.id as string"
						:align="cardData.block_button_group.alignment"
					/>
				</div>
			</div>
		</div>
	</div>
</template>

<style lang="scss" scoped>
.carousel-card-content {
	max-width: 100%;
	border-radius: var(--rounded-xl);
	text-align: center;
	display: flex;
	flex-direction: column;
	align-items: center;
	img {
		border-radius: var(--rounded-lg);
		margin-bottom: var(--space-3);
		width: 100%;
		object-fit: cover;
	}
}

.content-container {
	position: relative;
	width: 100%;
}

.card-content {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: var(--space-4);
	padding-bottom: var(--space-2);
	transition: opacity 0.3s ease-in-out;
}

.is-hidden {
	opacity: 0;
	pointer-events: none;
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
	max-width: var(--space-80);
	word-wrap: break-word;
	line-height: var(--line-height-2xl);
	overflow-wrap: break-word;
}
.description {
	order: 1;
	min-height: calc(var(--line-height-2xl) * 1.5);
	@media (max-width: 768px) {
		max-width: 80%;
	}
}

.button-container {
	order: 2;
	width: 100%;
}

.custom-button-group {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: var(--space-4);
}

.custom-button-group :deep(.button-group) {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: var(--space-4);
}

@media (max-width: 768px) {
	.carousel-card-content {
		margin-left: var(--space-0);
		img {
			max-width: 70%;
			margin-left: var(--space-0);
		}
	}
}
</style>
