<script setup lang="ts">
export interface BaseCardProps {
	title: string;
	description?: string;
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
}

const props = withDefaults(defineProps<BaseCardProps>(), {
	layout: 'vertical',
	aspect: '16-9',
});

const aspect = computed(() => {
	if (props.mediaStyle?.endsWith('16-9')) return '16-9';
	return '1-1';
});
</script>

<template>
	<NuxtLink :href="to" class="base-card" :class="[`direction-${layout}`, `style-${mediaStyle}`]">
		<div
			v-if="mediaStyle !== 'none' && mediaStyle !== 'image-title' && image"
			class="image"
			:class="[`aspect-${aspect}`]"
		>
			<BaseDirectusImage :uuid="image" :alt="title" />
		</div>

		<div class="content">
			<h3 class="heading">
				<BaseDirectusImage v-if="image && mediaStyle === 'image-title'" class="icon" :uuid="image" :alt="title" />
				<BaseIcon v-else-if="icon && mediaStyle === 'icon-title'" class="icon" :name="icon" />

				<span>{{ title }}</span>
			</h3>

			<p v-if="description" class="description">
				{{ description }}
				<slot />
			</p>
		</div>
	</NuxtLink>
</template>

<style lang="scss" scoped>
.base-card {
	container-type: inline-size;
	color: var(--black);
	text-decoration: none;
	display: block;

	&:hover .heading :not(.icon) {
		text-decoration: underline;
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

.description {
	color: var(--gray-400);
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
		gap: var(--space-10);

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
