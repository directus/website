<script setup lang="ts">
export interface BaseCardProps {
	title: string;
	description?: string;
	image?: string;
	to?: string;
	layout?: 'vertical' | 'horizontal';
	aspect?: '16-9' | '1-1';
	imageSize?: 'inline' | 'icon' | 'cover';
}

withDefaults(defineProps<BaseCardProps>(), {
	layout: 'vertical',
	aspect: '16-9',
	imageSize: 'cover',
});
</script>

<template>
	<NuxtLink :to="to" class="base-card" :class="`direction-${layout}`">
		<div v-if="image && imageSize !== 'inline'" class="image" :class="[`aspect-${aspect}`, `size-${imageSize}`]">
			<BaseDirectusImage :uuid="image" :alt="title" />
		</div>

		<div class="content">
			<h3 class="heading">
				<BaseDirectusImage v-if="image && imageSize === 'inline'" :uuid="image" :alt="title" />
				{{ title }}
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
	color: inherit;
	text-decoration: none;
	display: block;

	&:hover .heading {
		text-decoration: underline;
	}
}

.image {
	width: 100%;
	border-radius: var(--rounded-lg);
	overflow: hidden;
	background-color: var(--purple-50);
	margin-block-end: var(--space-2);

	&.size-cover > img {
		object-fit: cover;
		object-position: center center;
		width: 100%;
		height: 100%;
	}

	&.size-icon > img {
		height: 100%;
		max-height: 50%;
		width: auto;
	}

	&.size-icon {
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
}

.heading {
	font-size: var(--font-size-base);
	line-height: var(--line-height-base);
	font-weight: 600;
	display: flex;

	> img {
		width: var(--space-6);
		height: var(--space-6);
		object-fit: contain;
		margin-inline-end: var(--space-2);
	}

	&:has(img) {
		margin-block-end: var(--space-1);
	}
}

.description {
	font-size: var(--font-size-sm);
	line-height: var(--line-height-sm);
	color: var(--gray-400);
}

.base-card.direction-horizontal {
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
