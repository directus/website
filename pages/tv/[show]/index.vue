<script setup>
const { $directusTv, $readSingleton, $readItems } = useNuxtApp();

const route = useRoute();

const {
	public: { tvUrl, baseUrl },
} = useRuntimeConfig();

const { data: show } = await useAsyncData(
	'tv-' + route.params.show,
	() => {
		return $directusTv.request($readItems('shows', { filter: { slug: { _eq: route.params.show } } }));
	},
	{
		transform: (data) => data[0],
	},
);

const { data: seasons } = await useAsyncData('tv-' + route.params.show + '-seasons', () => {
	return $directusTv.request(
		$readItems('seasons', {
			filter: { show: { _eq: unref(show).id } },
			sort: ['-number'],
		}),
	);
});

const { data: episodes } = await useAsyncData('tv-' + route.params.show + '-episodes', () => {
	return $directusTv.request(
		$readItems('episodes', {
			fields: ['*', { season: ['*'] }],
			filter: { season: { show: { _eq: unref(show).id } } },
			sort: ['season.number', 'episode_number'],
		}),
	);
});

const [latest] = unref(episodes).length > 0 ? unref(episodes).slice(-1) : [];

const heroButtons = latest
	? [
			{
				type: 'primary',
				icon: 'play_arrow',
				text: 'Play Latest Episode',
				href: `/tv/${unref(show).slug}/${unref(latest).slug}`,
			},
	  ]
	: [];

const listing = unref(seasons)
	.map((season) => {
		const seasonEps = unref(episodes).filter((episode) => episode.season.id == season.id);
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
	title: `${unref(show).title} | Directus TV`,
	ogTitle: `${unref(show).title} | Directus TV`,
	description: unref(show).description,
	ogDescription: unref(show).description,
	ogImage: `${tvUrl}/assets/${unref(show).tile}`,
	twitterCard: 'summary_large_image',
	ogUrl: `${baseUrl}/tv/${route.params.show}`,
});
</script>

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
