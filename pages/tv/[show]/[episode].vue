<template>
	<ThemeProvider variant="dark" class="player-page">
		<div class="player-inner">
			<TVNavigation />
			<iframe
				:src="`https://player.vimeo.com/video/${episode.vimeo_id}?h=44d49687ad&amp;badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479`"
				frameborder="0"
				allow="fullscreen; picture-in-picture"
				allowfullscreen
			></iframe>
		</div>
		<BaseContainer>
			<div class="nav">
				<BaseButton
					label="Back to Show"
					class="secondary"
					:href="`/tv/${route.params.show}`"
					icon-start="arrow_back"
					color="white"
					size="small"
					outline
				/>
				<BaseButton
					v-if="next"
					:label="isNextSeason ? 'Next Season' : 'Next Episode'"
					class="secondary"
					:href="`/tv/${route.params.show}/${next.slug}`"
					icon="arrow_forward"
					color="white"
					size="small"
					outline
				/>
			</div>
			<div class="meta">
				<div class="details">
					<h1>{{ episode.title }}</h1>
					<small>
						<NuxtLink :to="`/tv/${route.params.show}`">{{ episode.season.show.title }}</NuxtLink>
						<span>Season {{ episode.season.number }}</span>
						<span>Episode {{ episode.episode_number }}</span>
						<span>{{ formatDate(episode.published) }}</span>
					</small>
					<p>{{ episode.description }}</p>
				</div>
				<div class="links">
					<NuxtLink :to="`/tv/${route.params.show}`" class="show">
						<img
							:src="`${directusUrl}/assets/${episode.season.show.tile}?width=600`"
							:alt="episode.season.show.title"
						/>
					</NuxtLink>
					<div v-if="episode.people" class="people">
						<h2>People</h2>
						<ul>
							<li v-for="person in episode.people" :key="person.url">
								<a :href="person.url" target="_blank">{{ person.name }}</a>
							</li>
						</ul>
					</div>
					<div v-if="episode.resources" class="resources">
						<h2>Resources</h2>
						<ul>
							<li v-for="resource in episode.resources" :key="resource.url">
								<a :href="resource.url" target="_blank">{{ resource.name }}</a>
							</li>
						</ul>
					</div>
				</div>
			</div>
		</BaseContainer>
	</ThemeProvider>
</template>

<script setup>
import { createDirectus, rest, readItems } from '@directus/sdk';

const {
	public: { tvUrl, baseUrl },
} = useRuntimeConfig();

const route = useRoute();

const directusUrl = process.env.DIRECTUS_TV_URL || tvUrl;
const directus = createDirectus(directusUrl).with(rest());

const [episode] = await directus.request(
	readItems('episodes', {
		fields: ['*', { season: ['*', { show: ['title', 'tile'] }] }],
		filter: { slug: { _eq: route.params.episode } },
	}),
);

const [next] = await directus.request(
	readItems('episodes', {
		fields: ['*'],
		filter: {
			_and: [
				// Same show
				{
					season: {
						show: {
							slug: {
								_eq: route.params.show,
							},
						},
					},
				},
				{
					_or: [
						// Is the next episode in this season
						{
							_and: [
								{
									season: {
										number: {
											_eq: episode.season.number,
										},
									},
								},
								{
									episode_number: { _eq: episode.episode_number + 1 },
								},
							],
						},
						// Is the first episode of the next season
						{
							_and: [
								{
									season: {
										number: {
											_eq: episode.season.number + 1,
										},
									},
								},
								{
									episode_number: { _eq: 1 },
								},
							],
						},
					],
				},
			],
		},
	}),
);

const isNextSeason = next?.episode_number == 1;

const formatDate = (dateString) => {
	const formatted = new Intl.DateTimeFormat('en-US', {
		day: 'numeric',
		month: 'long',
		year: 'numeric',
	})
		.format(new Date(dateString))
		.split(',')
		.join('');

	return formatted;
};

definePageMeta({
	layout: 'tv',
});

useSeoMeta({
	title: `${episode.title} | Directus TV`,
	ogTitle: `${episode.title} | Directus TV`,
	description: episode.description,
	ogDescription: episode.description,
	ogImage: `${directusUrl}/assets/${episode.tile}`,
	twitterCard: 'summary_large_image',
	ogUrl: `${baseUrl}/tv/${route.params.show}/${route.params.episode}`,
});
</script>

<style lang="scss" scoped>
iframe {
	width: 100%;
	aspect-ratio: 16/9;
	background: black;
}

.nav {
	display: flex;
	justify-content: space-between;
	margin-top: 2rem;
	a {
		--background-color: rgba(255, 255, 255, 0.12);
		color: white;
		outline: 2px solid white;
		&:hover {
			color: white !important;
			--background-color: rgba(255, 255, 255, 0.25);
		}
	}
}

.meta {
	display: grid;
	gap: 1rem;
	margin: 3rem 0;
	h1 {
		margin-top: 0;
		line-height: 1;
	}
	small {
		display: flex;
		gap: 1em;
		margin-top: 0.5rem;
		a {
			display: none;
			color: inherit;
			text-decoration: none;
		}
	}
	p {
		margin-top: 2rem;
	}
}
.links {
	display: flex;
	flex-direction: column-reverse;
	gap: 2rem;
	margin-bottom: 2rem;
	img {
		border-radius: var(--rounded-lg);
	}
	a {
		color: inherit;
	}
	h2 {
		font-size: 1rem;
	}
	ul {
		margin: 0.5rem 0 0;
	}
}

@media (width > 60rem) {
	.meta {
		grid-template-columns: auto 300px;
		gap: 4rem;
	}
	.links {
		flex-direction: column;
		gap: 2rem;
	}
}
</style>
