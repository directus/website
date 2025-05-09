<script setup lang="ts">
import type { BlockProps } from '../types';
import { computed } from 'vue';
import useVisualEditing from '~/composables/useVisualEditing';

const { $directus, $readItem } = useNuxtApp();
const { autoApply, setAttr, isVisualEditingEnabled } = useVisualEditing();

interface MasonryGridCardProps extends BlockProps {
	uuid: string;
}

const props = defineProps<MasonryGridCardProps>();

const { data: cardData, refresh } = useAsyncData(`masonry-grid-card-${props.uuid}`, () =>
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

autoApply(`[data-block-id="${props.uuid}"]`, refresh);
</script>

<template>
	<a
		v-if="cardData"
		:href="titleHref"
		:target="isExternal ? '_blank' : '_self'"
		rel="noopener noreferrer"
		:class="['masonry-card-content', cardData.size === 'double' ? 'double-card' : 'single-card']"
		:data-block-id="props.uuid"
		:data-directus="
			isVisualEditingEnabled
				? setAttr({
						collection: 'block_masonry_grid_card',
						item: cardData.id,
						fields: ['title', 'image', 'description', 'external_url', 'size', 'page', 'resource'],
						mode: 'modal',
					})
				: undefined
		"
	>
		<BaseDirectusImage v-if="cardData?.image" :uuid="cardData?.image as string" :alt="cardData?.title ?? ''" />
		<h2 class="title">{{ cardData?.title }}</h2>
		<p v-if="cardData?.description" class="description">{{ cardData.description }}</p>
	</a>
</template>

<style lang="scss" scoped>
.masonry-card-content {
	background-color: #f5f8fb;
	border-radius: var(--rounded-lg);
	overflow: hidden;
	position: relative;
	height: 290px;
	transition: transform 0.3s ease;
	display: block;
	text-decoration: none;

	&.single-card {
		flex: 1 1 290px;
		margin: 0 1% 1% 0;
	}

	&.double-card {
		flex: 2 1 500px;
		margin: 0 1% 1% 0;
	}

	&:hover {
		img {
			filter: grayscale(0%) opacity(100%);
		}

		.title {
			color: var(--primary-500);
		}
	}

	img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		filter: grayscale(100%) opacity(40%);
		transition: filter 0.3s ease-in-out;
	}

	.title {
		position: absolute;
		top: 0;
		left: 0;
		padding: var(--space-7);
		color: var(--gray-600);
		font-family: var(--family-display);
		font-size: var(--font-size-2xl);
		font-weight: 600;
		line-height: var(--line-height-2xl);
		transition: color 0.3s ease;
	}

	.description {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		background: rgba(255, 255, 255, 0.8);
		padding: var(--space-3) var(--space-4);
		border-radius: var(--rounded-md);
		color: var(--gray-500);
		font-size: var(--font-size-base);
		font-family: var(--family-display);
		line-height: var(--line-height-base);
		text-align: center;
		width: 80%;
	}
}
</style>
