<template>
	<TVHero
		:cover="globals.featured.season.show.cover"
		:logo="globals.featured.season.show.logo"
		:title="`Episode ${globals.featured.episode_number}: ${globals.featured.title}`"
		:description="globals.featured.description"
		:buttons="heroButtons"
	/>
	<BaseContainer class="main">
		<section class="categories">
			<TVCategory v-for="category in categories" :key="category.id" :title="category.title" :shows="category.shows" />
		</section>
	</BaseContainer>
</template>

<script setup>
import { createDirectus, rest, readItems, readSingleton } from '@directus/sdk';

const {
	public: { tvUrl, baseUrl },
} = useRuntimeConfig();

const directusUrl = process.env.DIRECTUS_TV_URL || tvUrl;
const directus = createDirectus(directusUrl).with(rest());

const globals = await directus.request(
	readSingleton('globals', { fields: ['og', { featured: ['*', { season: [{ show: ['*'] }] }] }] }),
);

const categories = await directus.request(
	readItems('categories', {
		fields: ['id', 'title', { shows: [{ shows_id: ['*'] }] }],
	}),
);

const heroButtons = [
	{
		type: 'primary',
		icon: 'play_arrow',
		text: 'Play Episode',
		href: `/tv/${globals.featured.season.show.slug}/${globals.featured.slug}`,
	},
	{
		type: 'secondary',
		icon: 'arrow_forward',
		text: 'Details',
		href: `/tv/${globals.featured.season.show.slug}`,
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
	ogImage: `${directusUrl}/assets/${globals.og}`,
	twitterCard: 'summary_large_image',
	ogUrl: `${baseUrl}/tv`,
});
</script>

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

@media (width > 60rem) {
	.categories {
		gap: 4rem;
	}
}
</style>
