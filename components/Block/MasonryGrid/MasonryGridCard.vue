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
		<div class="content">
			<h2 class="title">{{ cardData?.title }}</h2>
		</div>
		<div v-if="cardData?.description" class="description-popover">
			<div class="description-content">
				<p>{{ cardData.description }}</p>
			</div>
		</div>
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
			transform: scale(1.05);
		}

		.title {
			color: var(--primary-500);
		}

		.description-popover {
			opacity: 1;
			transform: translateY(0);

			.description-content {
				transform: translateY(0);
				opacity: 1;
			}
		}
	}

	img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		filter: grayscale(100%) opacity(40%);
		transition:
			filter 0.4s ease-in-out,
			transform 0.4s ease-out;
	}

	.content {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		padding: var(--space-7);
		z-index: 2;
	}

	.title {
		color: var(--gray-600);
		font-family: var(--family-display);
		font-size: var(--font-size-2xl);
		font-weight: 600;
		line-height: var(--line-height-2xl);
		transition: color 0.3s ease;
	}

	.description-popover {
		position: absolute;
		left: 0;
		right: 0;
		bottom: 0;
		top: 5rem;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: var(--space-7);
		opacity: 0;
		transform: translateY(8px);
		transition:
			opacity 0.3s ease-out,
			transform 0.3s ease-out;
		z-index: 1;
		pointer-events: none;
	}

	.description-content {
		background: linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.9) 100%);
		backdrop-filter: blur(8px);
		padding: var(--space-5) var(--space-6);
		border-radius: var(--rounded-lg);
		box-shadow:
			0 4px 24px rgba(0, 0, 0, 0.08),
			0 1px 2px rgba(0, 0, 0, 0.04);
		max-width: 90%;
		transform: translateY(12px);
		opacity: 0;
		transition:
			transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1),
			opacity 0.3s ease-out;
		transition-delay: 0.05s;

		p {
			color: var(--gray-600);
			font-size: var(--font-size-base);
			font-family: var(--family-display);
			line-height: var(--line-height-base);
			text-align: left;
			text-wrap: balance;
			margin: 0;
		}
	}
}
</style>
