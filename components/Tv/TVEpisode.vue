<template>
  <NuxtLink :to="`/tv/${show.slug}/${episode.slug}`" class="episode">
    <img :src="`${directusUrl}/assets/${episode.tile}?width=600`" alt="" />
    <div>
      <h3>
        <span v-if="!hideNumber">Episode {{ episode.episode_number }}:</span>
        {{ episode.title }}
        <span class="meta">
          <span v-if="episode.length">{{ episode.length }}m</span>
          <span>{{ formatDate(episode.published) }}</span>
        </span>
      </h3>
      <p>{{ episode.description }}</p>
    </div>
  </NuxtLink>
</template>

<script setup>
const {
  public: { tvUrl },
} = useRuntimeConfig();

const directusUrl = process.env.DIRECTUS_TV_URL || tvUrl;

defineProps({
  show: Object,
  episode: Object,
  hideNumber: Boolean,
});

const formatDate = (dateString) => {
  const formatted = new Intl.DateTimeFormat('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
    .format(new Date(dateString))
    .split(',')
    .join('');

  return formatted;
};
</script>

<style lang="scss" scoped>
.episode {
  list-style-type: none;
  text-decoration: none;
  color: inherit;
  display: grid;
  gap: 1em;
  img {
    width: 100%;
    border-radius: var(--rounded-lg);
  }
  h3 .meta {
    opacity: 0.5;
    margin-left: 0.5rem;
    font-size: 0.8rem;
    span:not(:last-child):after {
      content: '\2022';
      margin: 0 0.5em;
    }
  }
  p {
    margin: 0.5em 0;
  }
}

@media (width > 60rem) {
  .episode {
    grid-template-columns: 300px auto;
  }
}

@media (width > 35rem) {
  .episode {
    grid-template-columns: 200px auto;
    gap: 2em;
  }
  p {
    margin: 1em 0;
  }
}
</style>
