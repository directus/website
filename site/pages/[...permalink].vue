<script setup lang="ts">
import { readItems } from '@directus/sdk';

const { $directus } = useNuxtApp();
const { path } = useRoute();

const constructPageFilter = (path: string) => {
	const finalPath = path.endsWith('/') ? path.slice(0, -1) : path;
	return { permalink: { _eq: finalPath } };
};

const page = await useAsyncData(path, () => {
	return $directus.request(
		readItems('pages', {
			filter: constructPageFilter(path),
			fields: ['id', 'title'],
		})
	);
});

useHead({
	title: computed(() => page.data.value?.[0].title ?? null),
});
</script>

<template>
	<div>
		<!-- <PageBuilder :page="page" /> -->
	</div>
</template>
