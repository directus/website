<script lang="ts" setup>
useServerHead({
	htmlAttrs: { lang: 'en-US' },
	meta: [
		{ charset: 'UTF-8' },
		{ property: 'og:type', content: 'website' },
		{ property: 'og:url', content: 'https://directus.io/' },
	],
	link: [
		{
			rel: 'icon',
			href: '/favicon.ico',
		},
		{
			rel: 'icon',
			type: 'image/svg+xml',
			href: '/favicon.svg',
		},
		{
			rel: 'apple-touch-icon',
			href: '/apple-touch-icon.png',
		},
		{
			rel: 'mask-icon',
			href: 'safari-pinned-tab.svg',
			color: '#5bbad5',
		},
	],
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
