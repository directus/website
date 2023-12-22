<template>
	<NuxtLink :to="`/tv/${slug}`" class="show">
		<img :src="`${directusUrl}/assets/${tile}?width=300`" :alt="title" />
		<h3>{{ title }}</h3>
	</NuxtLink>
</template>

<script setup>
const {
	public: { tvUrl },
} = useRuntimeConfig();

const directusUrl = process.env.DIRECTUS_TV_URL || tvUrl;

defineProps({
	slug: String,
	tile: String,
	title: String,
});
</script>

<style lang="scss" scoped>
.show {
	width: 200px;
	display: block;
	text-decoration: none;
	img {
		width: 100%;
		border-radius: var(--rounded-lg);
	}
	h3 {
		color: white;
		font-size: 0.8rem;
		margin-top: 0.5rem;
	}
}

@media (width > 60rem) {
	.show {
		width: 300px;
	}
}
</style>
