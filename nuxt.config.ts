export default defineNuxtConfig({
	telemetry: false,
	ssr: true,
	css: ['~/assets/css/main.css'],

	scripts: {
		registry: {
			googleTagManager: true,
		},
	},

	devtools: {
		enabled: true,
	},

	runtimeConfig: {
		public: {
			directusUrl: process.env.DIRECTUS_URL as string,
			tvUrl: process.env.DIRECTUS_TV_URL as string,
			baseUrl: process.env.NUXT_PUBLIC_SITE_URL as string,
			enableVisualEditing: process.env.NUXT_PUBLIC_ENABLE_VISUAL_EDITING !== 'false',
			scripts: {
				googleTagManager: {
					id: process.env.GOOGLE_TAG_MANAGER_ID!,
				},
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
		buildCache: true,
	},

	nitro: {
		prerender: {
			crawlLinks: false,
			concurrency: 3,
		},
	},

	routeRules: {},

	modules: [
		'@vueuse/nuxt',
		'@nuxt/image',
		'@nuxt/fonts', // https://sitemap.nuxtjs.org/usage/sitemap
		'@nuxt/scripts',
		'@nuxtjs/sitemap',
		'nuxt-og-image',
		'@nuxt/icon',
		'floating-vue/nuxt',
		'nuxt-schema-org',
		'@formkit/auto-animate/nuxt',
	],

	// OG Image Configuration - https://nuxtseo.com/og-image/getting-started/installation
	ogImage: {
		zeroRuntime: true,
		defaults: {
			component: 'OgImageDefault',
			width: 1200,
			height: 630,
		},
		fonts: ['Inter:400', 'Inter:700', 'Poppins:400', 'Poppins:600', 'Poppins:700'],
	},

	// Posthog configuration
	posthog: {
		capturePageViews: true,
		host: (() => {
			if (process.env.CONTEXT) {
				return process.env.CONTEXT === 'production'
					? `${process.env.URL}/ingest`
					: `${process.env.DEPLOY_PRIME_URL}/ingest`;
			}

			return process.env.POSTHOG_API_HOST;
		})(),
	},

	// Nuxt Image Configuration - https://image.nuxt.com/get-started/installation
	image: {
		providers: {
			directus: {
				provider: 'directus',
				options: {
					baseURL: `${process.env.DIRECTUS_URL}/assets/`,
				},
			},
			directusTv: {
				provider: 'directus',
				options: {
					baseURL: `${process.env.DIRECTUS_TV_URL}/assets/`,
				},
			},
		},
	},

	// This is some jank to exit the nuxt build because the build hangs at the very end when using nuxt generate 🤦‍♂️
	// @see https://github.com/nuxt/cli/issues/169#issuecomment-1729300497
	// Workaround for https://github.com/nuxt/cli/issues/169
	hooks: {
		close: () => {
			process.exit();
		},
	},

	compatibilityDate: '2024-09-09',

	vue: {
		propsDestructure: true,
	},
});
