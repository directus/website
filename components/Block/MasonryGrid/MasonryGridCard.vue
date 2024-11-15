<script setup lang="ts">
import type { BlockProps } from '../types';
import { computed } from 'vue';

const { $directus, $readItem } = useNuxtApp();

interface MasonryGridCardProps extends BlockProps {
	uuid: string;
}

const props = defineProps<MasonryGridCardProps>();

const { data: cardData } = useAsyncData(`masonry-grid-card-${props.uuid}`, () =>
	$directus.request(
		$readItem('block_masonry_grid_card', props.uuid, {
			fields: [
				'id',
				'type',
				'title',
				'image',
				'description',
				'external_url',
				'size',
				{
					page: ['permalink'],
					resource: ['slug'],
				},
			],
		}),
	),
);

const titleHref = computed(() => {
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

const isExternal = computed(() => !!cardData.value?.external_url);
</script>

<template>
	<div v-if="cardData" :class="['masonry-card-content', cardData.size === 'double' ? 'double-card' : 'single-card']">
		<BaseDirectusImage v-if="cardData?.image" :uuid="cardData?.image as string" :alt="cardData?.title ?? ''" />
		<h2 class="title">
			<a :href="titleHref" :target="isExternal ? '_blank' : '_self'" rel="noopener noreferrer">
				{{ cardData?.title }}
			</a>
		</h2>
		<p v-if="cardData?.description" class="description">{{ cardData.description }}</p>
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
		filter: grayscale(100%) opacity(40%);
		transition: filter 0.3s ease-in-out;

		&:hover {
			filter: grayscale(0%) opacity(100%);
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
		font-weight: 600;
		line-height: 32px;

		a {
			color: inherit;
			text-decoration: none;
			transition: color 0.3s ease;

			&:hover {
				color: var(--primary-500);
			}
		}
	}

	.description {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		background: rgba(255, 255, 255, 0.8);
		padding: 12px 16px;
		border-radius: 6px;
		color: #6b7b8c;
		font-size: 16px;
		font-family: 'Poppins', sans-serif;
		line-height: 1.5;
		text-align: center;
		width: 80%;
	}
}
</style>
