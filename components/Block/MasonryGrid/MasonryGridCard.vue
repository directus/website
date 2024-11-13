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
		width: 290px; // Single card width
	}

	&.double-card {
		width: 500px; // Double card width
	}

	img {
		position: absolute;
		top: 0;
		left: 0;
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
		position: relative;
		z-index: 2;
		padding: 8px;
		border-radius: 4px;
		margin: 8px;
		font-size: 16px;
	}
}
@media (max-width: 1024px) {
	.masonry-card-content {
		&.single-card {
			width: 200px; // Adjust width for smaller screens
		}

		&.double-card {
			width: 350px; // Adjust width for smaller screens
		}
	}
}
@media (max-width: 768px) {
	.masonry-card-content {
		height: 180px;
		width: 100%;
	}
	img {
		display: none;
	}
}
</style>
