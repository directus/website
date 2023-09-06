import { createDirectus, readItems, rest } from '@directus/sdk';
import type { Schema } from './types/schema';

const fetchPagePermalinks = async () => {
	if (!process.env.DIRECTUS_URL) {
		// eslint-disable-next-line no-console
		console.log('Directus URL missing');
		return [];
	}

	const directus = createDirectus<Schema>(process.env.DIRECTUS_URL).with(rest());

	const permalinks = [];

	const pages = await directus.request(
		readItems('pages', {
			fields: ['permalink'],
			limit: -1,
		})
	);

	const resources = await directus.request(readItems('resources', { fields: ['slug', { type: ['slug'] }], limit: -1 }));

	const team = await directus.request(
		readItems('team', {
			// Filter for core team members or members with resources so we don't render like 100 empty pages
			filter: {
				_or: [
					{
						type: {
							_eq: 'core-team',
						},
					},
					{
						resources: {
							_nnull: true,
						},
					},
				],
			} as any, // @TODO fix as any when SDK is updated
			fields: ['slug'],
			limit: -1,
		})
	);

	permalinks.push(...pages.map((page) => page.permalink));
	permalinks.push(...resources.map((resource) => `/${resource.type.slug}/${resource.slug}`));
	permalinks.push(...team.map((member) => `/team/${member.slug}`));

	return permalinks;
};

export default defineNuxtConfig({
	ssr: true,

	css: ['~/assets/css/main.css'],

	runtimeConfig: {
		public: {
			directusUrl: process.env.DIRECTUS_URL,
			gtm: {
				id: process.env.GOOGLE_TAG_MANAGER_ID,
			},
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
		'floating-vue/nuxt',
    '@zadigetvoltaire/nuxt-gtm'
	],

	vite: {
		vue: {
			script: {
				defineModel: true,
			},
		},
	},
});
