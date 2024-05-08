<script setup>
const { $directusTv, $readSingleton, $readItems } = useNuxtApp();

const {
	public: { baseUrl, tvUrl },
} = useRuntimeConfig();

const { data: globals } = await useAsyncData('tv-globals-deep', () => {
	return $directusTv.request(
		$readSingleton('globals', {
			fields: ['og', { featured: ['*', { season: [{ show: ['*'] }] }] }],
		}),
	);
});

const { data: categories } = await useAsyncData('tv-categories', () => {
	return $directusTv.request(
		$readItems('categories', {
			fields: ['id', 'title', { shows: [{ shows_id: ['*'] }] }],
		}),
	);
});

const { data: live } = await useAsyncData('live-home', () => {
	return $directusTv.request($readSingleton('live', { fields: ['title', 'live_link_on_home'] }));
});

const heroButtons = [
	{
		type: 'primary',
		icon: 'play_arrow',
		text: 'Play Episode',
		href: `/tv/${unref(globals).featured.season.show.slug}/${unref(globals).featured.slug}`,
	},
	{
		type: 'secondary',
		icon: 'arrow_forward',
		text: 'Details',
		href: `/tv/${unref(globals).featured.season.show.slug}`,
	},
];

definePageMeta({
	layout: 'tv',
});

const seoTitle = 'Directus TV';
const seoDesc = 'Go down the rabbit hole with hours of original video content from the team at Directus.';

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
	<TVHero
		:cover="globals.featured.season.show.cover"
		:logo="globals.featured.season.show.logo"
		:title="`Episode ${globals.featured.episode_number}: ${globals.featured.title}`"
		:description="globals.featured.description"
		:buttons="heroButtons"
	/>
	<BaseContainer class="main">
		<NuxtLink v-if="live.live_link_on_home" to="/tv/live" class="live">
			<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><circle cx="50" cy="50" r="50" /></svg>
			<span>Now Live: {{ live.title }}</span>
			<BaseIcon class="arrow-forward" name="arrow_forward" />
		</NuxtLink>
		<section class="categories">
			<TVCategory v-for="category in categories" :key="category.id" :title="category.title" :shows="category.shows" />
		</section>
	</BaseContainer>
</template>

<style lang="scss" scoped>
.main {
	padding-bottom: 8em;
}
.categories {
	margin-top: 4rem;
	display: flex;
	flex-direction: column;
	gap: 2rem;
}
.live {
	--red: #e35169;
	background: var(--red);
	border: 1px solid #922637;
	color: white;
	padding: 1rem;
	margin-top: 4rem;
	border-radius: var(--rounded-lg);
	text-decoration: none;
	display: flex;
	gap: 0.5rem;
	svg {
		height: 1.25rem;
		margin-top: 2px;
		fill: white;
	}
	.arrow-forward {
		--foreground: white;
		margin-left: auto;
	}
}
@media (width > 60rem) {
	.categories {
		gap: 4rem;
	}
}
</style>
