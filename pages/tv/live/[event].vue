<template>
	<ThemeProvider variant="dark" class="player-page">
		<div class="player-inner">
			<TVNavigation />
			<BaseContainer class="player">
				<iframe
					:src="`https://vimeo.com/event/${event.vimeo_id}/embed${event.interaction ? '/interaction' : ''}`"
					frameborder="0"
					allow="fullscreen; picture-in-picture"
					allowfullscreen
				></iframe>
			</BaseContainer>
		</div>
		<BaseContainer>
			<div class="meta">
				<div class="details">
					<h1>{{ event.title }}</h1>
					<p>{{ event.description }}</p>
				</div>
				<div class="links">
					<ul>
						<li>Links</li>
					</ul>
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

const [event] = await directus.request(
	readItems('events', {
		filter: { slug: { _eq: route.params.event } },
	}),
);

definePageMeta({
	layout: 'tv',
});

useSeoMeta({
	title: `${event.title} | Directus TV`,
	ogTitle: `${event.title} | Directus TV`,
	description: event.description,
	ogDescription: event.description,
	ogImage: `${directusUrl}/assets/${event.tile}`,
	twitterCard: 'summary_large_image',
	ogUrl: `${baseUrl}/tv/live/${route.params.event}`,
});
</script>

<style scoped>
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
}

.meta {
	display: grid;
	gap: 1rem;
	margin-top: 3rem;
	.details p {
		margin-top: 1em;
	}
}

@media (width > 60rem) {
	.meta {
		grid-template-columns: auto 300px;
		gap: 4rem;
	}
}
</style>
