<script setup lang="ts">
definePageMeta({
	layout: 'blank',
});

const { $directus, $readItems } = useNuxtApp();
const { params, path } = useRoute();

const { data: page } = await useAsyncData(
	path,
	() => {
		return $directus.request(
			$readItems('articles', {
				limit: 1,
			})
		);
	},
	{
		transform: (data) => data[0],
	}
);
</script>

<template>
	<ImageOg
		:title="page.title"
		:image-uuid="page.image"
		author-name="Test Author"
		author-image="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2080&q=80"
		badge-label="Test Badge"
	/>
</template>
