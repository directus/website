<script lang="ts" setup>
useHead({
	htmlAttrs: { lang: 'en' },
});

useSchemaOrg([
	defineOrganization({
		name: 'Directus',
		logo: '/images/logo-dark.svg',
		sameAs: [
			'https://hub.docker.com/r/directus/directus',
			'https://twitter.com/directus',
			'https://github.com/directus',
			'https://www.youtube.com/c/DirectusVideos',
			'https://www.linkedin.com/company/directus-io',
			'https://www.npmjs.com/package/directus',
		],
	}),
]);
</script>

<template>
	<NuxtLayout>
		<NuxtPage />
	</NuxtLayout>
</template>
