<script setup lang="ts">
// import { Page } from '~~/types/schema';
// import { page_block_fields, flattenFieldTree } from '~/page-block-fields';
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

			/** @TODO fields don't match new SDK structure */
			// fields: flattenFieldTree(page_block_fields),
			fields: ['title'],
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
		<!-- Show JSON data when in dev mode -->
		<!-- <DevOnly>
			<div class="">
				<pre>{{ page }}</pre>
			</div>
		</DevOnly> -->
	</div>
</template>
