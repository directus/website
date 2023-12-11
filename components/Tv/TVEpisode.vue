<template>
	<NuxtLink :to="`/rabbit-hole/${show.slug}/${episode.slug}`" class="show">
		<img :src="`${directusUrl}/assets/${episode.tile}`" alt="" />
		<div>
			<h3>
				{{ episode.title }}
				<span>{{ episode.length }}m</span>
			</h3>
			<p>{{ episode.description }}</p>
		</div>
	</NuxtLink>
</template>

<script setup>
const directusUrl = process.env.DIRECTUS_TV_URL;

defineProps({
	show: Object,
	episode: Object,
});
</script>
