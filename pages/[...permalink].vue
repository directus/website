<script setup lang="ts">
import { Page } from '~~/types';

const { $directus } = useNuxtApp();
const { path } = useRoute();

// Since this is a catch-all route, let's use the route.path, instead of route.params
function constructPageFilter(path: string) {
	const finalPath = path.endsWith('/') ? path.slice(0, -1) : path;
	return { permalink: { _eq: finalPath } };
}

// Fetch the page data from the Directus API using the Nuxt useAsyncData composable
// https://nuxt.com/docs/getting-started/data-fetching#useasyncdata
const {
	data: page = {} as Ref<Page>,
	pending,
	error,
} = await useAsyncData(
	path,
	() => {
		return $directus.items('pages').readByQuery({
			filter: constructPageFilter(path),
			fields: ['*', 'seo.*', 'blocks.collection', 'blocks.item.*'],
			limit: 1,
		});
	},
	{
		transform: (data: object) => data.data[0],
		pick: ['title', 'blocks', 'slug', 'id', 'seo'],
	}
);

useHead({
	title: () => page.value.title,
});
</script>
<template>
	<div>
		<PageBuilder :page="page" />
	</div>
</template>
