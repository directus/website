<script setup lang="ts">
export interface BaseCardProps {
	title: string;
	description?: string;
	descriptionAvatar?: string;
	image?: string;
	icon?: string;
	to?: string;
	layout?: 'vertical' | 'horizontal';
	mediaStyle:
		| 'none'
		| 'image-fill-16-9'
		| 'image-fill-1-1'
		| 'image-centered-16-9'
		| 'image-centered-1-1'
		| 'icon-centered-16-9'
		| 'icon-centered-1-1'
		| 'image-title'
		| 'icon-title'
		| 'icon-above-title';
	badge?: string;
}

const props = withDefaults(defineProps<BaseCardProps>(), {
	layout: 'vertical',
});

const aspect = computed(() => {
	if (props.mediaStyle?.endsWith('16-9')) return '16-9';
	return '1-1';
});

const component = computed(() => {
	if (props.to) return resolveComponent('NuxtLink');
	return 'div';
});

const imageDimensions = computed(() => {
	const width = 280;

	let height = 280;

	if (unref(aspect) !== '1-1') {
		height = 156;
	}

	return { width, height };
});
</script>

<template>
	<component :is="component" :href="to" class="base-card" :class="[`direction-${layout}`, `style-${mediaStyle}`]">
		<div
			v-if="mediaStyle !== 'none' && mediaStyle !== 'image-title' && image"
			class="image"
			:class="[`aspect-${aspect}`]"
		>
			<BaseDirectusImage :width="imageDimensions.width" :height="imageDimensions.height" :uuid="image" :alt="title" />
		</div>

		<div class="content">
			<BaseBadge v-if="badge" class="badge" :label="badge" />

			<h3 class="heading">
				<BaseDirectusImage
					v-if="image && mediaStyle === 'image-title'"
					:width="24"
					:height="24"
					class="icon"
					:uuid="image"
					:alt="title"
				/>
				<BaseIcon v-else-if="icon && mediaStyle === 'icon-title'" class="icon" :name="icon" />

				<span>{{ title }}</span>
			</h3>

			<p v-if="description" class="description">
				<BaseDirectusImage
					v-if="descriptionAvatar"
					:width="20"
					:height="20"
					class="avatar"
					:uuid="descriptionAvatar"
					alt=""
				/>
				{{ description }}
				<slot />
			</p>
		</div>
	</component>
</template>

<style lang="scss" scoped>
.base-card {
	container-type: inline-size;
	color: var(--black);
	text-decoration: none;
	display: block;
	position: relative;

	&:is(a) {
		&:hover {
			.heading {
				text-decoration: underline;
			}

			&:is(.style-image-fill-16-9, .style-image-fill-1-1) .image img {
				scale: 1.03;
			}
		}
	}
}

.image {
	width: 100%;
	border-radius: var(--rounded-lg);
	overflow: hidden;
	background-color: var(--purple-50);
	margin-block-end: var(--space-2);

	:is(.style-image-fill-16-9, .style-image-fill-1-1) & img {
		object-fit: cover;
		object-position: center center;
		width: 100%;
		height: 100%;
		transition: scale var(--duration-300) var(--ease-out);
	}

	.style-image-title & > img {
		height: 100%;
		max-height: 50%;
		width: auto;
	}

	.style-image-centered & {
		display: flex;
		align-items: center;
		justify-content: center;
	}

	&.aspect-16-9 {
		aspect-ratio: 16/9;
	}

	&.aspect-1-1 {
		aspect-ratio: 1;
	}

	:is(.style-icon-above-title) & {
		background-color: transparent;
		aspect-ratio: auto;

		img {
			block-size: var(--space-8);
			inline-size: auto;
		}
	}
}

.heading {
	font-size: var(--font-size-base);
	line-height: var(--line-height-base);
	font-weight: 600;
	display: flex;

	img.icon {
		width: var(--space-6);
		height: var(--space-6);
		object-fit: contain;
	}

	.icon {
		margin-inline-end: var(--space-2);
	}

	:is(.style-image-title, .style-icon-title) & {
		margin-block-end: var(--space-2);
	}
}

.badge + .heading {
	margin-block-start: var(--space-2);
}

.description {
	color: var(--gray-400);
	display: flex;
	align-items: center;
	gap: 0 var(--space-2);
}

.avatar {
	width: var(--space-5);
	height: var(--space-5);
	object-fit: cover;
	border-radius: var(--rounded-full);
}

.base-card.direction-horizontal {
	.description {
		font-size: var(--font-size-sm);
		line-height: var(--line-height-sm);
	}

	@container (width > 25rem) {
		display: flex;
		gap: var(--space-5);
		align-items: center;

		.image {
			flex-basis: var(--space-32);
			flex-grow: 1;
			flex-shrink: 0;
			margin-block-end: 0;
		}

		.content {
			flex-basis: var(--space-48);
			flex-grow: 3;
		}
	}

	@container (width > 35rem) {
		gap: var(--space-5);

		.image,
		.content {
			flex-basis: var(--space-32);
			flex-grow: 1;
		}

		.heading {
			font-size: var(--font-size-lg);
			line-height: var(--line-height-lg);
			margin-block-end: var(--space-2);
		}
	}
}
</style>
