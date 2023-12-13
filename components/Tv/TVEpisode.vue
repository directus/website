<template>
	<NuxtLink :to="`/tv/${show.slug}/${episode.slug}`" class="episode">
		<img :src="`${directusUrl}/assets/${episode.tile}`" alt="" />
		<div>
			<h3>
				{{ episode.episode_number }}:
				{{ episode.title }}
				<span>{{ episode.length }}m</span>
			</h3>
			<p>{{ episode.description }}</p>
		</div>
	</NuxtLink>
</template>

<script setup>
const {
	public: { tvUrl },
} = useRuntimeConfig();

const directusUrl = process.env.DIRECTUS_TV_URL || tvUrl;

defineProps({
	show: Object,
	episode: Object,
});
</script>

<style lang="scss" scoped>
.episode {
	list-style-type: none;
	text-decoration: none;
	color: inherit;
	display: grid;
	gap: 1em;
	img {
		width: 100%;
		border-radius: var(--rounded-lg);
	}
	h3 span {
		opacity: 0.5;
		margin-left: 0.5rem;
		font-size: 0.8rem;
	}
	p {
		margin: 0.5em 0;
	}
}

@media (width > 60rem) {
	.episode {
		grid-template-columns: 300px auto;
	}
}

@media (width > 35rem) {
	.episode {
		grid-template-columns: 200px auto;
		gap: 2em;
	}
	p {
		margin: 1em 0;
	}
}
</style>
