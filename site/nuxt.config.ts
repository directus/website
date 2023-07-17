// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	css: ['@directus/website-components/styles'],
	devtools: { enabled: true },
	typescript: {
		typeCheck: true,
	},
	modules: [['@directus/website-components/nuxt', { dev: true }]],
});
