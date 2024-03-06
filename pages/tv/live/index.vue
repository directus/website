<template>
	<div
		id="hero"
		:style="`background-image: linear-gradient(0deg, rgba(9,23,41,0) 50%, rgba(9,23,41) 100%), url(${directusUrl}/assets/${globals.live_header}`"
	>
		<TVNavigation />
	</div>
	<BaseContainer class="main">
		<ul class="events">
			<li v-for="event in events" :key="event.id">
				<TVEpisode :show="{ slug: 'live' }" :episode="event" :hide-number="true" />
			</li>
		</ul>
	</BaseContainer>
</template>

<script setup>
import { createDirectus, rest, readItems, readSingleton } from '@directus/sdk';

const {
	public: { tvUrl, baseUrl },
} = useRuntimeConfig();

const directusUrl = process.env.DIRECTUS_TV_URL || tvUrl;
const directus = createDirectus(directusUrl).with(rest());

const globals = await directus.request(readSingleton('globals'));

let events = await directus.request(
	readItems('events', { sort: ['date_start'], filter: { status: { _eq: 'published' } } }),
);

events = events.map((event) => ({ ...event, published: event.date_start }));

definePageMeta({
	layout: 'tv',
});

const seoTitle = 'Directus TV Live';
const seoDesc = 'Live events from the team at Directus.';

useSeoMeta({
	title: seoTitle,
	ogTitle: seoTitle,
	description: seoDesc,
	ogDescription: seoDesc,
	ogImage: `${directusUrl}/assets/${globals.og}`,
	twitterCard: 'summary_large_image',
	ogUrl: `${baseUrl}/tv`,
});
</script>

<style scoped>
#hero {
	background-size: cover;
	background-position: center;
	min-height: 30rem;
}
.main {
	flex: 1;
}
.events {
	margin-top: 4rem;
	padding-left: 0;
	list-style-type: none;
	margin-bottom: 4em;
}
li {
	margin-top: 2em;
}
</style>
