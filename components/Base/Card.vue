<script setup lang="ts">
export interface BaseCardProps {
	title: string;
	description?: string;
	image?: string;
	to?: string;
	layout?: 'vertical' | 'horizontal';
	aspect?: '16-9' | '1-1';
	imageSize?: 'icon' | 'cover';
}

withDefaults(defineProps<BaseCardProps>(), {
	layout: 'vertical',
	aspect: '16-9',
	imageSize: 'cover',
});
</script>

<template>
	<NuxtLink :to="to" class="base-card" :class="`direction-${layout}`">
		<div class="image" :class="[`aspect-${aspect}`, `size-${imageSize}`]">
			<BaseDirectusImage v-if="image" :uuid="image" :alt="title" />
		</div>

		<h3 class="heading">{{ title }}</h3>

		<p v-if="description" class="description">
			{{ description }}
			<slot />
		</p>
	</NuxtLink>
</template>

<style lang="scss" scoped>
.base-card {
	container-type: inline-size;
	color: inherit;
	text-decoration: none;

	&:hover {
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
}

.description {
	font-size: var(--font-size-sm);
	line-height: var(--line-height-sm);
	color: var(--gray-400);
}
</style>
