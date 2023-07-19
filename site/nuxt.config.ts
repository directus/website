import { createDirectus, readItems, rest, staticToken } from '@directus/sdk';
import type { Schema } from './types/schema';

const fetchPagePermalinks = async () => {
	if (!process.env.DIRECTUS_URL || !process.env.DIRECTUS_TOKEN) {
		throw new Error('Directus URL or Token missing');
	}

	const directus = createDirectus<Schema>(process.env.DIRECTUS_URL)
		.with(staticToken(process.env.DIRECTUS_TOKEN))
		.with(rest());

	const permalinks = await directus.request(
		readItems('pages', {
			fields: ['permalink'],
			limit: -1,
		})
	);

	return permalinks.map((page) => page.permalink);
};

export default defineNuxtConfig({
	devtools: { enabled: true },

	css: ['~/assets/css/main.css'],

	runtimeConfig: {
		public: {
			directusUrl: process.env.DIRECTUS_URL,
			directusToken: process.env.DIRECTUS_TOKEN,
			/** @TODO: Dont forget to move this back to non-public or erase it entirely and set collection permissions to public inside Directus instance */
		},
	},

	typescript: {
		typeCheck: true,
	},

	hooks: {
		async 'nitro:config'(nitroConfig) {
			const permalinks = await fetchPagePermalinks();
			nitroConfig.prerender?.routes?.push(...permalinks);
		},
	},
});
