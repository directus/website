<script setup>
defineProps({
	url: String,
	slug: String,
	tile: String,
	title: String,
	description: String,
	overlay: String,
});

const {
	public: { tvUrl },
} = useRuntimeConfig();

const directusUrl = process.env.DIRECTUS_TV_URL || tvUrl;
</script>

<template>
	<NuxtLink :to="url ? url : `/tv/${slug}`" class="show">
		<div class="tile" :style="`background-image: url(${directusUrl}/assets/${tile}?width=600)`">
			<span v-if="overlay">{{ overlay }}</span>
		</div>
		<h3>{{ title }}</h3>
		<p>{{ description }}</p>
	</NuxtLink>
</template>

<style lang="scss" scoped>
.show {
	width: 100%;
	display: block;
	text-decoration: none;
	.tile {
		width: 100%;
		aspect-ratio: 16/9;
		background-size: cover;
		background-repeat: no-repeat;
		background-position: center;
		border-radius: var(--rounded-lg);
		position: relative;
		span {
			background: var(--tv-background);
			position: absolute;
			right: 0;
			top: 13px;
			padding: 0 6px;
			color: white;
			border-top-left-radius: var(--rounded-md);
			border-bottom-left-radius: var(--rounded-md);
			font-size: 0.8rem;
		}
	}
	h3 {
		color: white;
		font-size: 1rem;
		margin-top: 0.75rem;
	}
	p {
		color: var(--gray-600);
		opacity: 0.8;
		font-size: 0.8rem;
		margin-top: 0.5rem;
		line-height: var(--line-height-sm);
	}
}
</style>
