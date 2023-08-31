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
								'slug',
								'summary',
								'category',
								{ author: ['name', 'job_title', 'image'], image: ['id', 'description'], type: ['slug'] },
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
		<TransitionGroup name="slide">
			<NuxtLink
				v-for="({ resources_id: resource }, index) in block.resources"
				v-show="activeSlide === index"
				:key="resource.id"
				:href="`/${resource.type.slug}/${resource.slug}`"
			>
				<article class="two-up">
					<BaseMedia class="image">
						<BaseDirectusImage
							:width="780"
							:height="440"
							:uuid="resource.image.id"
							:alt="resource.image.description ?? ''"
						/>
					</BaseMedia>

					<div>
						<div class="meta">
							<BaseBadge v-if="resource.category" class="badge" :label="resource.category" />

							<span v-if="resource.category && resource.date_published" class="separator">•</span>

							<time v-if="resource.date_published" class="publish-date" :datetime="resource.date_published">
								{{
									new Intl.DateTimeFormat('en-US', { dateStyle: 'medium' }).format(new Date(resource.date_published))
								}}
							</time>
						</div>

						<h2>{{ resource.title }}</h2>

						<BaseByline
							v-if="resource.author"
							class="byline"
							:name="resource.author.name"
							:title="resource.author.job_title ?? undefined"
							:image="resource.author.image ?? undefined"
						/>
					</div>
				</article>
			</NuxtLink>
		</TransitionGroup>

		<div class="controls">
			<BaseSlideIndicator v-model="activeSlide" :length="block.resources?.length ?? 0" />
			<BaseCircularProgress :percentage="progress" />
		</div>
	</article>
</template>

<style lang="scss" scoped>
.block-resource-slider {
	position: relative;

	a {
		color: var(--foreground);
		text-decoration: none;
	}

	.image {
		width: 100%;
		height: auto;
		overflow: hidden;

		:deep(img) {
			scale: 1;
			transition: scale var(--duration-300) var(--ease-out);
		}
	}

	&:hover .image :deep(img) {
		scale: 1.03;
	}

	.two-up {
		display: grid;
		gap: var(--space-8);
		align-items: center;

		@container (width > 40rem) {
			grid-template-columns: 2fr 1fr;
		}
	}

	.meta {
		display: flex;
		color: var(--gray-400);

		.separator {
			display: block;
			margin-inline: var(--space-2);
		}
	}

	h2 {
		font-family: var(--family-display);
		font-size: var(--font-size-base);
		line-height: var(--line-height-base);
		margin-block: var(--space-4);

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

	p {
		color: var(--gray-400);
		margin-block-end: var(--space-3);
	}

	a:hover h2 {
		text-decoration: underline;
	}

	.controls {
		position: absolute;
		inset-block-end: var(--space-5);
		inset-inline-start: var(--space-5);
		display: flex;
		align-items: center;
		gap: var(--space-4);

		* {
			--color: var(--background);
			--track-color: color-mix(in srgb, transparent, var(--background) 50%);
			--hover-color: color-mix(in srgb, transparent, var(--background) 70%);

			flex-shrink: 0;
		}
	}
}

.slide-enter-active,
.slide-leave-active {
	transition: opacity var(--duration-500) var(--ease-in-out);
}

.slide-enter-from,
.slide-leave-to {
	opacity: 0;
}

.slide-leave-active {
	position: absolute;
	top: 0;
}
</style>
