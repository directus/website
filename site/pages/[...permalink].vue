<script setup lang="ts">
import { Page } from '~~/types';
import { page_block_fields, flattenFieldTree } from '~/page-block-fields';

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
			fields: flattenFieldTree(page_block_fields),
			limit: 1,
		});
	},
	{
		transform: (data: object) => data.data[0],
	}
);
</script>

<template>
	<div>
		<PageBuilder :page="page" />
		<!-- Show JSON data when in dev mode -->
		<!-- <DevOnly>
			<div class="">
				<pre>{{ page }}</pre>
			</div>
		</DevOnly> -->
	</div>
</template>
