<script setup lang="ts">
definePageMeta({
	layout: 'blank',
});

// Import the $directus plugin
const { $directus } = useNuxtApp();

// Get the params from the Nuxt route
const { params, path, query } = useRoute();

const { data: page } = await useAsyncData(
	path,
	() => {
		return $directus.items('pages').readByQuery({
			filter: {
				slug: { _eq: params.slug },
			},
			limit: 1,
			fields: ['*'],
		});
	},
	{
		transform: (data) => data.data[0],
		pick: ['title'],
	}
);

const type = query.type ?? 'og';
</script>
<template>
	<ImageOg
		v-if="type === 'og'"
		:image-url="fileUrl(page.image)"
		:title="page.title"
		:summary="page.summary"
		:read-time="calculateReadTime(page.content)"
		:badge-label="page.category.title"
		:badge-color="page.category.color"
	/>
</template>
