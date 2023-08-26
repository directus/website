import { createDirectus, readItems, rest, staticToken } from '@directus/sdk';
import type { Schema } from './types/schema';

const fetchPagePermalinks = async () => {
	if (!process.env.DIRECTUS_URL || !process.env.DIRECTUS_TOKEN) {
		// eslint-disable-next-line no-console
		console.log('Directus URL or Token missing');
		return [];
	}

	const directus = createDirectus<Schema>(process.env.DIRECTUS_URL)
		.with(staticToken(process.env.DIRECTUS_TOKEN))
		.with(rest());

	const permalinks = [];

	const pages = await directus.request(
		readItems('pages', {
			fields: ['permalink'],
			limit: -1,
		})
	);

	const resources = await directus.request(readItems('resources', { fields: ['slug', { type: ['slug'] }], limit: -1 }));

	permalinks.push(...pages.map((page) => page.permalink));

	permalinks.push(...resources.map((resource) => `/${resource.type.slug}/${resource.slug}`));

	/** @TODO Add team members to prerender routes */
	// const team = await directus.request(readItems('team', { fields: ['slug'], limit: -1 }));

	// permalinks.push(...team.map((member) => ({ permalink: `/team/${member.slug}` })));

	return permalinks;
};

export default defineNuxtConfig({
	ssr: true,

	css: ['~/assets/css/main.css'],

	runtimeConfig: {
		public: {
			directusUrl: process.env.DIRECTUS_URL,
			directusToken: process.env.DIRECTUS_TOKEN,
			/** @TODO Dont forget to move this back to non-public or erase it entirely and set collection permissions to public inside Directus instance */
		},
	},

	typescript: {
		typeCheck: true,
	},

	experimental: {
		payloadExtraction: true,
	},

	hooks: {
		async 'nitro:config'(nitroConfig) {
			const permalinks = await fetchPagePermalinks();
			nitroConfig.prerender?.routes?.push(...permalinks);
		},
	},

	nitro: {
		prerender: {
			crawlLinks: false,
			concurrency: 3,
		},
	},

	modules: [
		'@vueuse/nuxt',
		'nuxt-simple-sitemap', // https://nuxtseo.com/sitemap/getting-started/how-it-works
	],

	vite: {
		vue: {
			script: {
				defineModel: true,
			},
		},
	},
});
