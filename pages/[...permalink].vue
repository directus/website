<script setup lang="ts">
import { Page } from '~~/types';

const { $directus } = useNuxtApp();
const { params, path } = useRoute();

// Since this is a catch-all route, params.permalink may contain an array of slugs.
function constructPageFilter(routeParam: string | string[]) {
	let finalPermalink = routeParam;

	if (Array.isArray(routeParam)) {
		finalPermalink = `/${routeParam.join('/')}`;
	}

	if (finalPermalink.endsWith('/')) {
		finalPermalink = finalPermalink.slice(0, -1);
	}

	return {
		permalink: { _eq: finalPermalink },
	};
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
			filter: constructPageFilter(params.permalink),
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
