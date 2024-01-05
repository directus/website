<template>
	<ThemeProvider variant="dark">
		<TVHero
			:cover="show.cover"
			:logo="show.logo"
			:title="show.announcement_text"
			:description="show.description"
			:buttons="heroButtons"
		/>
		<BaseContainer class="main">
			<section v-if="listing.length > 0" class="seasons">
				<div v-for="season in listing" :key="season.id" class="season">
					<h2>
						Season {{ season.number }}
						<span>{{ season.year }}</span>
					</h2>
					<ul class="episodes">
						<li v-for="episode in season.episodes" :key="episode.id">
							<TVEpisode :show="show" :episode="episode" />
						</li>
					</ul>
				</div>
			</section>
		</BaseContainer>
	</ThemeProvider>
</template>

<script setup>
const route = useRoute();

import { createDirectus, rest, readItems } from '@directus/sdk';

const {
	public: { tvUrl, baseUrl },
} = useRuntimeConfig();

const directusUrl = process.env.DIRECTUS_TV_URL || tvUrl;
const directus = createDirectus(directusUrl).with(rest());

const [show] = await directus.request(readItems('shows', { filter: { slug: { _eq: route.params.show } } }));

const seasons = await directus.request(
	readItems('seasons', {
		filter: { show: { _eq: show.id } },
		sort: ['-number'],
	}),
);

const episodes = await directus.request(
	readItems('episodes', {
		fields: ['*', { season: ['*'] }],
		filter: { season: { show: { _eq: show.id } } },
		sort: ['season.number', 'episode_number'],
	}),
);

const [latest] = episodes.length > 0 ? episodes.slice(-1) : [];

const heroButtons = latest
	? [
			{
				type: 'primary',
				icon: 'play_arrow',
				text: 'Play Latest Episode',
				href: `/tv/${show.slug}/${latest.slug}`,
			},
	  ]
	: [];

const listing = seasons
	.map((season) => {
		const seasonEps = episodes.filter((episode) => episode.season.id == season.id);
		return {
			...season,
			episodes: seasonEps,
		};
	})
	.filter((listing) => listing.episodes.length > 0);

definePageMeta({
	layout: 'tv',
});

useSeoMeta({
	title: `${show.title} | Directus TV`,
	ogTitle: `${show.title} | Directus TV`,
	description: show.description,
	ogDescription: show.description,
	ogImage: `${directusUrl}/assets/${show.tile}`,
	twitterCard: 'summary_large_image',
	ogUrl: `${baseUrl}/tv/${route.params.show}`,
});
</script>

<style lang="scss" scoped>
.season {
	margin-top: 4rem;
}

h2 span {
	opacity: 0.5;
	margin-left: 0.5em;
	font-size: 0.8em;
}

.episodes {
	list-style-type: none;
	padding-left: 0;
	display: flex;
	flex-direction: column;
	gap: 2em;
	margin-top: 2rem;
	margin-bottom: 4rem;
}
</style>
