<script setup>
const { $directusTv, $readSingleton, $readItems } = useNuxtApp();

const {
	public: { tvUrl, baseUrl },
} = useRuntimeConfig();

const { data: globals } = await useAsyncData('tv-globals', () => {
	return $directusTv.request($readSingleton('globals'));
});

const { data: events } = await useAsyncData('tv-events', () => {
	return $directusTv.request(
		$readItems('events', {
			sort: ['date_start'],
			filter: { status: { _eq: 'published' } },
		}),
	);
});

events.value = unref(events).map((event) => ({ ...event, published: event.date_start }));

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
	ogImage: `${tvUrl}/assets/${unref(globals).og}`,
	twitterCard: 'summary_large_image',
	ogUrl: `${baseUrl}/tv`,
});
</script>

<template>
	<div
		id="hero"
		:style="`background-image: linear-gradient(0deg, rgba(9,23,41,0) 50%, rgba(9,23,41) 100%), url(${tvUrl}/assets/${globals.live_header}`"
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
