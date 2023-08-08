<script setup lang="ts">
const { $directus, $readItems } = useNuxtApp();
const { path } = useRoute();

const pageFilter = computed(() => {
	let finalPath;

	if (path === '/') {
		finalPath = '/';
	} else if (path.endsWith('/')) {
		finalPath = path.slice(0, -1);
	} else {
		finalPath = path;
	}

	return { permalink: { _eq: finalPath } };
});

const { data: page, error } = await useAsyncData(
	path,
	() => {
		return $directus.request(
			$readItems('pages', {
				filter: unref(pageFilter),
				fields: [
					'title',
					{
						sections: [
							'id',
							'background',
							'negative_top_margin',
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

if (!unref(page)) {
	console.log(unref(error));
	// throw createError({ statusCode: 404, statusMessage: 'Page Not Found' });
}

useHead({
	title: computed(() => unref(page)?.title ?? null),
});
</script>

<template>
	<PageBuilder v-if="page && page.sections" :sections="page.sections" />
</template>
