<template>
	<ThemeProvider variant="dark">
		<TVHero :cover="show.cover" :logo="show.logo" :description="show.description" :buttons="heroButtons" />
		<BaseContainer class="main">
			<section v-if="listing.length > 0" class="seasons">
				<div v-for="season in listing" :key="season.id" class="season">
					<h2>Season {{ season.number }}</h2>
					<ul class="shows">
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

const directusUrl = process.env.DIRECTUS_TV_URL;
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
				href: `/rabbit-hole/${show.slug}/${latest.slug}`,
			},
	  ]
	: [];

const listing = seasons.map((season) => {
	const seasonEps = episodes.filter((episode) => episode.season.id == season.id);
	return {
		...season,
		episodes: seasonEps,
	};
});

definePageMeta({
	layout: 'blank',
});

useHead({
	bodyAttrs: { class: 'tv' },
});

useSeoMeta({
	title: show.title,
	ogTitle: show.title,
	description: show.description,
	ogDescription: show.description,
	ogImage: `${process.env.DIRECTUS_TV_URL}/assets/${show.tile}`,
	twitterCard: 'summary_large_image',
});
</script>

<style lang="scss" scoped>
.season {
	margin-top: 4em;
}

.shows {
	list-style-type: none;
	padding-left: 0;
	display: flex;
	flex-direction: column;
	gap: 2em;
	margin-bottom: 4em;
}

.show {
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
	.show {
		grid-template-columns: 300px auto;
	}
}

@media (width > 35rem) {
	.show {
		grid-template-columns: 200px auto;
		gap: 2em;
	}
	p {
		margin: 1em 0;
	}
}
</style>
