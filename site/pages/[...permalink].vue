<script setup lang="ts">
/**
 * @TODO pageBlockFields is not a valid field selector
 */
// import { Page } from '~~/types/schema';
// import { pageBlockFields } from '~/page-block-fields';
// import { readItems } from '@directus/sdk';

// const { $directus } = useNuxtApp();
// const { path } = useRoute();

// const constructPageFilter = (path: string) => {
// 	const finalPath = path.endsWith('/') ? path.slice(0, -1) : path;
// 	return { permalink: { _eq: finalPath } };
// };

// const { data: page } = await useAsyncData(
// 	path,
// 	() => {
// 		return $directus.request(
// 			readItems('pages', {
// 				filter: constructPageFilter(path),
// 				fields: pageBlockFields,
// 			})
// 		);
// 	},
// 	{
// 		transform: (data) => data[0],
// 	}
// );

// useHead({
// 	title: computed(() => page.value?.title ?? null),
// });
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
