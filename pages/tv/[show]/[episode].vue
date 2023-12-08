<template>
	<ThemeProvider variant="dark">
		<TVNavigation />
		<BaseContainer class="main">
			<BaseButton
				label="Back to Episodes"
				class="back"
				:href="`/tv/${route.params.show}`"
				icon-start="chevron_left"
				color="white"
				size="large"
				outline
			/>
			<iframe
				:src="`https://player.vimeo.com/video/${episode.vimeo_id}?h=44d49687ad&amp;badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479`"
				frameborder="0"
				allow="fullscreen; picture-in-picture"
				allowfullscreen
			></iframe>
			<h1>{{ episode.title }}</h1>
			<div class="meta">
				<p>{{ episode.description }}</p>
				<ul>
					<li>
						<NuxtLink :to="`/tv/${route.params.show}`">
							<img :src="`${directusUrl}/assets/${episode.season.show.logo}`" :alt="episode.season.show.title" />
						</NuxtLink>
					</li>
					<li>Season {{ episode.season.number }} Episode {{ episode.episode_number }}</li>
					<li>{{ episode.length }} {{ episode.length > 1 ? 'minutes' : 'minute' }} long</li>
				</ul>
				<!-- TODO RESOURCES -->
				<!-- TODO PEOPLE -->
			</div>
		</BaseContainer>
	</ThemeProvider>
</template>

<script setup>
const route = useRoute();

import { createDirectus, rest, readItems } from '@directus/sdk';

const directusUrl = process.env.DIRECTUS_TV_URL;
const directus = createDirectus(directusUrl).with(rest());

const [episode] = await directus.request(
	readItems('episodes', {
		fields: ['*', { season: ['*', { show: ['title', 'logo'] }] }],
		filter: { slug: { _eq: route.params.episode } },
	}),
);

definePageMeta({
	layout: 'blank',
});

useHead({
	bodyAttrs: { class: 'tv' },
});
</script>

<style lang="scss" scoped>
.back {
	--background-color: rgba(255, 255, 255, 0.12);
	color: white;
	&:hover {
		color: inherit !important;
		--background-color: rgba(255, 255, 255, 0.25);
	}
}
iframe {
	width: 100%;
	aspect-ratio: 16/9;
	margin-top: 2em;
	border-radius: var(--rounded-lg);
}
h1 {
	margin: 2rem 0 1rem;
}
.meta {
	display: grid;
	grid-template-columns: auto 300px;
	gap: 2em;
	ul {
		margin: 0;
	}
}
</style>
