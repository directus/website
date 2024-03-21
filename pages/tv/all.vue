<template>
  <ThemeProvider variant="dark">
    <TVHero
      :cover="globals.featured.season.show.cover"
      :logo="globals.featured.season.show.logo"
      :title="globals.featured.title"
      :description="globals.featured.description"
      :buttons="heroButtons"
    />
    <BaseContainer class="main">
      <p class="stat">
        Displaying all {{ episodes.length }} episodes across {{ shows.length }} shows. We hope you enjoy them!
      </p>
      <ul class="episodes">
        <li v-for="episode in episodesWithShowTitles" :key="episode.id">
          <TVEpisode :show="episode.season.show" :episode="episode" :hide-number="true" />
        </li>
      </ul>
    </BaseContainer>
  </ThemeProvider>
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

const shows = await directus.request(readItems('shows', { fields: ['id'], limit: -1 }));

const episodes = await directus.request(
  readItems('episodes', {
    fields: ['*', { season: ['*', { show: ['title', 'slug'] }] }],
    sort: ['-published'],
    limit: -1,
  }),
);

const episodesWithShowTitles = episodes.map((episode) => {
  return {
    ...episode,
    title: `${episode.season.show.title}: ${episode.title}`,
  };
});

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

<style scoped>
.stat {
  margin-top: 4rem;
  margin-bottom: 1rem;
  font-size: 1.25rem;
  opacity: 0.5;
  line-height: 1.125;
}
.episodes {
  padding-left: 0;
  list-style-type: none;
  margin-bottom: 4em;
}
li {
  margin-top: 2em;
}
@media (width > 35rem) {
  .stat {
    font-size: 2rem;
  }
}
</style>
