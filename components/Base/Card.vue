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
	titleSize?: 'small' | 'medium' | 'large';
	iconSize?: 'medium' | 'large';
}

const props = withDefaults(defineProps<BaseCardProps>(), {
	layout: 'vertical',
	titleSize: 'medium',
	iconSize: 'medium',
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
	const width = 330;

	let height = 330;

	if (unref(aspect) !== '1-1') {
		height = 186;
	}

	return { width, height };
});
</script>

<template>
	<component
		:is="component"
		:href="to"
		class="base-card"
		:class="[`direction-${layout}`, `style-${mediaStyle}`, `title-${titleSize}`]"
	>
		<div
			v-if="mediaStyle !== 'none' && mediaStyle !== 'image-title' && mediaStyle !== 'icon-title' && (image || icon)"
			class="image"
			:class="[`aspect-${aspect}`, `icon-size-${iconSize}`]"
		>
			<BaseDirectusImage
				v-if="image"
				:width="imageDimensions.width"
				:height="imageDimensions.height"
				:uuid="image"
				:alt="title ?? ''"
			/>

			<BaseIcon v-else-if="icon" class="icon" :name="icon" />
		</div>

		<div class="content">
			<BaseBadge v-if="badge" class="badge" :label="badge" />

			<h3 class="heading">
				<BaseDirectusImage
					v-if="image && mediaStyle === 'image-title'"
					:width="24"
					:height="24"
					class="icon-img"
					:uuid="image"
					:alt="title ?? ''"
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
	--icon-color: var(--foreground);
	--icon-background-color: var(--gray-100);

	container-type: inline-size;
	color: var(--foreground);
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
	background-color: var(--gray-200);
	margin-block-end: var(--space-2);

	img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

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
		border-radius: 0;

		img {
			block-size: var(--space-8);
			inline-size: auto;
		}

		.icon {
			--base-icon-color: var(--icon-color);

			inline-size: var(--space-9);
			block-size: var(--space-9);
			border-radius: var(--rounded-md);
			background-color: var(--icon-background-color);
			display: flex;
			justify-content: center;
			align-items: center;
		}

		&.icon-size-large {
			img {
				block-size: var(--space-10);
			}

			.icon {
				inline-size: var(--space-12);
				block-size: var(--space-12);
			}
		}
	}
}

.heading {
	font-size: var(--font-size-base);
	line-height: var(--line-height-base);
	font-weight: 600;
	display: flex;
	margin-block-end: var(--space-1);

	img.icon {
		width: var(--space-6);
		height: var(--space-6);
		object-fit: contain;
	}

	.icon {
		margin-inline-end: var(--space-2);
	}
}

.badge + .heading {
	margin-block-start: var(--space-2);
}

.title-small .heading {
	font-size: var(--font-size-sm);
	line-height: var(--line-height-sm);
}

.title-large .heading {
	font-size: var(--font-size-xl);
	line-height: var(--line-height-xl);
	font-weight: 500;
}

.description {
	color: var(--gray-400);
	display: flex;
	align-items: center;
	gap: 0 var(--space-2);
	font-size: var(--font-size-sm);
	margin: 0;
	line-height: var(--line-height-sm);
}

.avatar {
	background-color: var(--gray-100);
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
			flex-basis: var(--space-1);
			flex-grow: 1;
			flex-shrink: 0;
			margin-block-end: 0;
		}

		.content {
			flex-basis: var(--space-6);
			flex-grow: 1;
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
