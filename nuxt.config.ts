// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	devtools: { enabled: true },

	runtimeConfig: {
		public: {
			directusUrl: process.env.DIRECTUS_URL,
		},
		directusToken: process.env.DIRECTUS_TOKEN,
	},
});
