<script setup lang="ts">
import { readItems } from '@directus/sdk';

const { $directus } = useNuxtApp();
const { path } = useRoute();

const pageFilter = computed(() => {
	const finalPath = path.endsWith('/') ? path.slice(0, -1) : path;
	return { permalink: { _eq: finalPath } };
});

const { data: page } = await useAsyncData(
	path,
	() => {
		return $directus.request(
			readItems('pages', {
				filter: unref(pageFilter),
				fields: [
					'title',
					{
						sections: [
							'id',
							'background',
							{
								blocks: ['id', 'collection', 'item'],
							},
						],
					},
				],
				limit: 1,
			})
		);
	},
	{
		transform: (data) => data[0],
	}
);

useHead({
	title: computed(() => unref(page)?.title ?? null),
});
</script>

<template>
	<PageBuilder v-if="page" :sections="page.sections" />
</template>
