<script setup lang="ts">
import type { BlockProps } from './types';

const { $directus, $readItem } = useNuxtApp();

const props = defineProps<BlockProps>();

const { data: block } = useAsyncData(props.uuid, () =>
	$directus.request(
		$readItem('block_resource_slider', props.uuid, {
			fields: [
				{
					resources: [
						{
							resources_id: [
								'id',
								'title',
								'date_published',
								{ author: ['name', 'job_title', 'image'], image: ['id', 'description'] },
							],
						},
					],
				},
			],
		})
	)
);

const {
	active: activeSlide,
	progress,
	loop,
	stop,
} = useSlider({ duration: 10000, length: unref(block)?.resources?.length ?? 0 });

loop();
</script>

<template>
	<article v-if="block" class="block-resource-slider" @pointerenter="stop" @pointerleave="loop">
		<article
			v-for="({ resources_id: resource }, index) in block.resources"
			v-show="activeSlide === index"
			:key="resource.id"
		>
			<BaseDirectusImage :uuid="resource.image.id" :alt="resource.image.description ?? ''" />
			<BaseByline
				v-if="resource.author"
				class="byline"
				:name="resource.author.name"
				:title="resource.author.job_title"
				:image="resource.author.image"
			/>
			<h2>{{ resource.title }}</h2>
		</article>

		<div class="controls">
			<BaseSlideIndicator v-model="activeSlide" :length="block.resources?.length ?? 0" />
			<BaseCircularProgress :percentage="progress" />
		</div>
	</article>
</template>

<style lang="scss" scoped>
.block-resource-slider {
	aspect-ratio: 16/9;
	position: relative;
	border-radius: var(--rounded-2xl);
	overflow: hidden;
	padding: var(--space-5);
	display: flex;
	justify-content: space-between;
	flex-direction: column;

	@container (width > 25rem) {
		flex-direction: row;
		align-items: flex-end;
		gap: var(--space-5);
	}

	@container (width > 35rem) {
		padding: var(--space-10);
		gap: var(--space-10);
	}

	&::after,
	img {
		content: '';
		inline-size: 100%;
		block-size: 100%;
		object-fit: cover;
		position: absolute;
		inset-inline: 0;
		inset-block: 0;
		z-index: -1;
	}

	&::after {
		opacity: 0.3;
		background: linear-gradient(180deg, var(--gray-100) 20.31%, var(--black) 79.69%);
	}

	img {
		z-index: -2;
	}

	.byline {
		--color: var(--white);
		--title-color: color-mix(in srgb, transparent, var(--white) 70%);
		--text-shadow: 0px 2px 4px rgba(14, 28, 47, 0.25);

		display: none;
		margin-block-end: var(--space-3);

		@container (width > 25rem) {
			display: flex;
		}
	}

	h2 {
		color: var(--white);
		text-shadow: 0px 2px 4px rgba(14, 28, 47, 0.25);
		font-family: var(--family-display);
		max-inline-size: 80%;
		font-size: var(--font-size-base);
		line-height: var(--line-height-base);

		@container (width > 25rem) {
			font-size: var(--font-size-lg);
			line-height: var(--line-height-lg);
		}

		@container (width > 35rem) {
			font-size: var(--font-size-2xl);
			line-height: var(--line-height-2xl);
		}

		@container (width > 50rem) {
			font-size: var(--font-size-4xl);
			line-height: var(--line-height-4xl);
		}
	}

	.controls {
		display: flex;
		align-items: center;
		gap: var(--space-4);
		flex-shrink: 0;
		align-self: flex-end;

		* {
			--color: var(--white);
			--track-color: color-mix(in srgb, transparent, var(--white) 50%);
			--hover-color: color-mix(in srgb, transparent, var(--white) 70%);

			flex-shrink: 0;
		}
	}
}
</style>
