<script setup lang="ts">
import { Page } from '~~/types';

const { $directus } = useNuxtApp();
const { path } = useRoute();

const constructPageFilter = (path: string) => {
	const finalPath = path.endsWith('/') ? path.slice(0, -1) : path;
	return { permalink: { _eq: finalPath } };
};

const { data: page = {} as Ref<Page> } = await useAsyncData(
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
