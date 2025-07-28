export default defineNuxtConfig({
	runtimeConfig: {
		marketplace: {
			registryUrl: process.env.DIRECTUS_MARKETPLACE_REGISTRY_URL as string,
			registryToken: process.env.DIRECTUS_MARKETPLACE_REGISTRY_TOKEN as string,
		},
		public: {
			typesenseUrl: process.env.TYPESENSE_URL,
			typesensePublicApiKey: process.env.TYPESENSE_PUBLIC_API_KEY,
		},
		typesensePrivateApiKey: process.env.TYPESENSE_PRIVATE_API_KEY as string,
		typesenseIndexingApiKey: process.env.TYPESENSE_INDEXING_API_KEY as string,
	},

	routeRules: {
		// Prerender all index routes but not the detail pages
		'/integrations': {
			prerender: true,
		},
		'/extensions': {
			prerender: true,
		},
		'/templates': {
			prerender: true,
		},
		'/integrations/**': {
			isr: true,
		},
		'/extensions/**': {
			isr: true,
		},
		'/templates/**': {
			isr: true,
		},
	},

	build: {
		transpile: [({ isDev }) => !isDev && 'typesense-instantsearch-adapter'],
	},

	vite: {
		optimizeDeps: {
			include: ['typesense-instantsearch-adapter'],
		},
	},
});
