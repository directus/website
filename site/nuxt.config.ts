// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	devtools: { enabled: true },

	css: ['~/assets/css/main.css'],

	runtimeConfig: {
		public: {
			directusUrl: process.env.DIRECTUS_URL,
			directusToken: process.env.DIRECTUS_TOKEN,
			// TODO: Dont forget to move this back to non-public or erase it entirely and set collection permissions to public inside Directus instance
		},
	},

	typescript: {
		typeCheck: true,
	},
});
