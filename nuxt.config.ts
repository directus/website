import { createDirectus, readItems, rest } from '@directus/sdk';
import type { Schema } from './types/schema';

const fetchPagePermalinks = async () => {
	if (!process.env.DIRECTUS_URL) {
		// eslint-disable-next-line no-console
		console.warn('DIRECTUS_URL environment variable missing');
		return [];
	}

	const directus = createDirectus<Schema>(process.env.DIRECTUS_URL).with(rest());

	const permalinks = [];

	const pages = await directus.request(
		readItems('pages', {
			fields: ['permalink'],
			limit: -1,
		}),
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
			},
			fields: ['slug'],
			limit: -1,
		}),
	);

	permalinks.push(...pages.map((page) => page.permalink));
	permalinks.push(...resources.map((resource) => `/${resource.type.slug}/${resource.slug}`));
	permalinks.push(...team.map((member) => `/team/${member.slug}`));

	return permalinks;
};

export default defineNuxtConfig({
	telemetry: false,
	ssr: true,

	css: ['~/assets/css/main.css'],

	runtimeConfig: {
		public: {
			directusUrl: process.env.DIRECTUS_URL,
			gtm: {
				id: process.env.GOOGLE_TAG_MANAGER_ID!,
			},
		},
	},

	site: {
		url: 'https://directus.io',
	},

	schemaOrg: {
		host: 'https://directus.io',
	},

	app: {
		head: {
			link: [
				{
					rel: 'alternate',
					type: 'application/atom+xml',
					title: 'Directus RSS Feed',
					href: '/rss.xml',
				},
			],
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
			nitroConfig.prerender?.routes?.push('/rss.xml');
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
		'@nuxt/image',
		'nuxt-simple-sitemap', // https://nuxtseo.com/sitemap/getting-started/how-it-works
		'nuxt-og-image',
		'floating-vue/nuxt',
		'@zadigetvoltaire/nuxt-gtm',
		'nuxt-schema-org',
	],

	// OG Image Configuration - https://nuxtseo.com/og-image/getting-started/installation
	ogImage: {
		defaults: {
			component: 'OgImageDefault',
			width: 1200,
			height: 630,
		},
		fonts: ['Inter:400', 'Inter:700', 'Poppins:400', 'Poppins:600', 'Poppins:700'],
	},

	// Nuxt Image Configuration - https://image.nuxtjs.org/getting-started/installation
	image: {
		provider: 'directus',
		directus: {
			baseURL: `${process.env.DIRECTUS_URL}/assets/`,
		},
	},

	vite: {
		vue: {
			script: {
				defineModel: true,
			},
		},
	},
});
