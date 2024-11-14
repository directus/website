<script setup lang="ts">
import type { BlockProps } from '../types';

const { $directus, $readItem } = useNuxtApp();

interface MasonryGridCardProps extends BlockProps {
	uuid: string;
}

const props = defineProps<MasonryGridCardProps>();

const { data: cardData } = useAsyncData(`masonry-grid-card-${props.uuid}`, () =>
	$directus.request(
		$readItem('block_masonry_grid_card', props.uuid, {
			fields: ['id', 'type', 'title', 'image'],
		}),
	),
);
</script>

<template>
	<div v-if="cardData" :class="['masonry-card-content', cardData.type === 'double' ? 'double-card' : 'single-card']">
		<BaseDirectusImage v-if="cardData?.image" :uuid="cardData?.image as string" :alt="cardData?.title ?? ''" />
		<h2 class="title">{{ cardData?.title }}</h2>
	</div>
</template>

<style lang="scss" scoped>
.masonry-card-content {
	background-color: #f5f8fb;
	border-radius: 8px;
	overflow: hidden;
	position: relative;
	height: 290px;
	transition: transform 0.3s ease;

	&.single-card {
		flex: 1 1 290px;
		margin: 0 1% 1% 0;
	}

	&.double-card {
		flex: 2 1 500px;
		margin: 0 1% 1% 0;
	}

	img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		filter: grayscale(100%);
		transition: filter 0.3s ease-in-out;

		&:hover {
			filter: grayscale(0%);
		}
	}

	.title {
		position: absolute;
		top: 0;
		left: 0;
		padding: 28px;
		color: var(--Foreground-Normal, #455466);
		font-family: Poppins;
		font-size: 24px;
		font-style: normal;
		font-weight: 600;
		line-height: 32px;
	}
}
</style>
