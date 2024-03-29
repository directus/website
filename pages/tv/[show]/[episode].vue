<script setup>
const { $directusTv, $readItems } = useNuxtApp();

const {
	public: { tvUrl, baseUrl },
} = useRuntimeConfig();

const route = useRoute();

const { data: episode } = await useAsyncData(
	route.params.show + '-' + route.params.episode,
	() => {
		return $directusTv.request(
			$readItems('episodes', {
				fields: [
					'*',
					{
						season: ['*', { show: ['title', 'tile'] }],
						episode_people: [
							{
								people_id: ['id', 'first_name', 'last_name', 'avatar', 'bio', 'links'],
							},
						],
						recommendations: [
							'id',
							'type',
							'title',
							'description',
							'url',
							'image',
							{
								recommended_episode_id: [
									'id',
									'title',
									'slug',
									'tile',
									'description',
									{
										season: [
											{
												show: ['slug'],
											},
										],
									},
								],
							},
						],
						seo: ['title', 'meta_description'],
					},
				],
				filter: { slug: { _eq: route.params.episode } },
			}),
		);
	},
	{
		transform: (data) => data[0],
	},
);

const { data: next } = await useAsyncData(
	route.params.show + '-' + route.params.episode + '-next',
	() => {
		return $directusTv.request(
			$readItems('episodes', {
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
													_eq: unref(episode).season.number,
												},
											},
										},
										{
											episode_number: { _eq: unref(episode).episode_number + 1 },
										},
									],
								},
								// Is the first episode of the next season
								{
									_and: [
										{
											season: {
												number: {
													_eq: unref(episode).season.number + 1,
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
	},
	{ transform: (data) => data[0] },
);

const isNextSeason = unref(next)?.episode_number == 1;

const recommendations = computed(() => {
	return unref(episode).recommendations.map((rec) => {
		if (rec.type === 'episode') {
			return {
				id: rec.recommended_episode_id.id,
				title: rec.recommended_episode_id.title,
				url: `/tv/${rec.recommended_episode_id.season.show.slug}/${rec.recommended_episode_id.slug}`,
				tile: rec.recommended_episode_id.tile,
				description: rec.recommended_episode_id.description,
			};
		} else if (rec.type === 'url') {
			return {
				id: rec.id,
				title: rec.title,
				url: rec.url,
				tile: rec.image,
				description: rec.description,
			};
		}
	});
});

const activeTab = ref('about');

const tabs = [
	{
		key: 'about',
		label: 'About',
	},
	{
		key: 'transcript',
		label: 'Transcript',
	},
];

definePageMeta({
	layout: 'tv',
});

useSeoMeta({
	title: `${unref(episode).seo?.title ?? unref(episode).title} | Directus TV`,
	ogTitle: `${unref(episode).seo?.title ?? unref(episode).title} | Directus TV`,
	description: unref(episode).seo?.meta_description ?? unref(episode).description,
	ogDescription: unref(episode).seo?.meta_description ?? unref(episode).description,
	ogImage: `${tvUrl}/assets/${unref(episode).tile}`,
	twitterCard: 'summary_large_image',
	ogUrl: `${baseUrl}/tv/${route.params.show}/${route.params.episode}`,
});

useSchemaOrg([
	defineVideo({
		name: unref(episode).title,
		description: unref(episode).description,
		thumbnailUrl: `${tvUrl}/assets/${unref(episode).tile}`,
		uploadDate: unref(episode).published,
		duration: unref(episode).duration,
		embedUrl: `${baseUrl}/tv/${route.params.show}/${route.params.episode}`,
		transcript: unref(episode).video_transcript_text,
	}),
]);
</script>

<template>
	<ThemeProvider variant="dark" class="player-page">
		<div class="player-inner">
			<TVNavigation />
			<BaseContainer class="player">
				<iframe
					:src="`https://player.vimeo.com/video/${episode.vimeo_id}?h=44d49687ad&amp;badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479`"
					frameborder="0"
					allow="fullscreen; picture-in-picture"
					allowfullscreen
				></iframe>
			</BaseContainer>
		</div>
		<BaseContainer>
			<div class="nav">
				<div>
					<BaseButton
						label="Back to Show"
						class="secondary"
						:href="`/tv/${route.params.show}`"
						icon-start="arrow_back"
						color="white"
						size="small"
						outline
					/>
				</div>
				<div class="reactions">
					<BaseText as="p" content="Rate This Episode" size="small" align="center" />
					<TVReactions :episode-id="episode.id" />
				</div>
				<div>
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
			</div>
			<div class="meta">
				<div class="details">
					<h1>{{ episode.title }}</h1>
					<small>
						<NuxtLink :to="`/tv/${route.params.show}`">{{ episode.season.show.title }}</NuxtLink>
						<span>Season {{ episode.season.number }}</span>
						<span>Episode {{ episode.episode_number }}</span>
						<span>{{ formatTvDate(episode.published, { day: 'numeric', month: 'long', year: 'numeric' }) }}</span>
					</small>
					<!-- Tabs -->
					<nav id="tabs">
						<button
							v-for="tab in tabs"
							:key="tab.key"
							:aria-selected="tab.key === activeTab"
							:label="tab.label"
							color="primary"
							@click="activeTab = tab.key"
						>
							{{ tab.label }}
						</button>
					</nav>
					<p v-show="activeTab === 'about'" id="about">{{ episode.description }}</p>
					<div v-show="activeTab === 'transcript'" id="transcript" class="transcript">
						<div class="notice">
							<BaseIcon name="info" />
							<span>Transcripts are automatically generated with AI and may contain errors.</span>
						</div>
						<BaseText :content="episode.video_transcript_html" color="foreground" />
					</div>
				</div>
				<div class="links">
					<NuxtLink :to="`/tv/${route.params.show}`" class="show">
						<img :src="`${tvUrl}/assets/${episode.season.show.tile}?width=600`" :alt="episode.season.show.title" />
					</NuxtLink>
					<div v-if="episode.people" class="people">
						<h2>People</h2>
						<ul class="people-list">
							<li v-for="{ people_id: person } in episode.episode_people" :key="person.url">
								<TVByline
									:name="person.first_name + ' ' + person.last_name"
									:title="person.bio ?? undefined"
									:image="person.avatar ?? undefined"
									:links="person.links"
								/>
							</li>
						</ul>
					</div>
					<div v-if="episode.resources" class="resources">
						<h2>Resources</h2>
						<ul>
							<li v-for="resource in episode.resources" :key="resource.url">
								<NuxtLink :href="resource.url" target="_blank">{{ resource.name }}</NuxtLink>
							</li>
						</ul>
					</div>
				</div>
			</div>
			<!-- Recommended content -->
			<template v-if="recommendations && recommendations.length > 0">
				<BaseDivider />
				<div class="recommended">
					<BaseHeading content="You might also like" tag="h3" size="sm" />
					<div class="list">
						<TVShow
							v-for="item in recommendations"
							:key="item.id"
							:tile="item.tile"
							:title="item.title"
							:description="item.description"
							:url="item.url"
						/>
					</div>
				</div>
			</template>
		</BaseContainer>
	</ThemeProvider>
</template>

<style lang="scss" scoped>
.player {
	grid-template-columns:
		[full-start] minmax(0, 1fr)
		[standard-start] 0
		[narrow-start] minmax(1rem, 75rem)
		[narrow-end] 0
		[standard-end] minmax(0, 1fr)
		[full-end];
}

iframe {
	width: 100%;
	aspect-ratio: 16/9;
	background: black;
	border-radius: 8px;
}

.nav {
	display: flex;
	flex-wrap: wrap;
	justify-content: space-between;
	gap: var(--space-4);
	align-items: center;
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
	.reactions {
		margin: 0 auto;
		order: 1;
	}
}

@media (width > 450px) {
	.nav {
		.reactions {
			order: 0;
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

#tabs {
	display: flex;
	gap: var(--space-2);
	margin-block-start: 2rem;
	padding-bottom: -2px;
	border-bottom: 2px solid var(--gray-100);
	button {
		background: none;
		border: none;
		color: var(--gray-500);
		cursor: pointer;
		font-size: 1rem;
		padding: 1rem 1rem;
		border-bottom: 4px solid transparent;
		&:hover {
			color: var(--gray-900);
		}
		&[aria-selected='true'] {
			color: var(--gray-900);
			border-bottom-color: var(--primary);
		}
	}
}

.transcript {
	height: 450px;
	margin-block-start: var(--space-4);
	overflow-y: auto;
	background: var(--gray-100);
	padding: var(--space-6);
	border-radius: var(--rounded-lg);

	.notice {
		padding: var(--space-2);
		display: flex;
		border: 1px solid var(--gray-200);
		border-radius: var(--rounded-xl);
		gap: var(--space-2);
		align-items: flex-start;
		margin-block-end: var(--space-4);
	}
}

.people-list {
	list-style: none;
	padding: 0;

	li + li {
		margin-top: 1rem;
		padding-top: 1rem;
		border-top: 1px solid var(--gray-100);
	}
}

.recommended {
	margin-block-start: var(--space-6);
	padding-block-end: var(--space-6);

	.list {
		margin-block-start: var(--space-4);
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
		gap: var(--space-8);
	}
}
</style>
