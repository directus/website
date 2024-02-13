export default defineNuxtConfig({
	telemetry: false,
	ssr: true,

	css: ['~/assets/css/main.css'],

	runtimeConfig: {
		public: {
			directusUrl: process.env.DIRECTUS_URL,
			tvUrl: process.env.DIRECTUS_TV_URL,
			baseUrl: process.env.NUXT_PUBLIC_SITE_URL,
			gtm: {
				id: process.env.GOOGLE_TAG_MANAGER_ID!,
				defer: true,
			},
		},
	},

	site: {
		url: 'https://directus.io',
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
		sharedPrerenderData: true,
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
		'@nuxtjs/sitemap', // https://nuxtseo.com/sitemap/getting-started/how-it-works
		'nuxt-og-image',
		'floating-vue/nuxt',
		'@zadigetvoltaire/nuxt-gtm',
		'nuxt-schema-org',
		'nuxt-icon',
		'@nuxtjs/fontaine',
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
});
