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
	width: 100%;
	transition: transform 0.3s ease;

	&.single-card {
		min-width: 290px;
		flex-grow: 1;
	}

	&.double-card {
		min-width: 500px;
		flex-grow: 2;
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
		position: absolute;
		top: 0;
		left: 0;
		z-index: 2;
		background-color: rgba(255, 255, 255, 0.8);
		padding: 8px;
		border-radius: 4px;
		margin: 8px;
		font-size: 16px;
		font-weight: bold;
	}
}

@media (max-width: 911px) {
	.masonry-card-content {
		&.double-card {
			grid-column: span 2;
			width: 100%;
		}
	}
}

@media (max-width: 819px) {
	.masonry-card-content {
		&.double-card {
			grid-column: span 1;
		}

		&.single-card {
			min-width: 250px;
		}
	}
}

@media (max-width: 768px) {
	.masonry-card-content {
		height: 180px;
		min-width: 100%;
		&.single-card {
			min-width: 100px;
		}

		&.double-card {
			min-width: 250px;
		}
	}
}
</style>
