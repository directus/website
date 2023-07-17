import { Directus } from '@directus/sdk';
import { Schema } from '~/types';
// Make sure you review the Directus SDK documentation for more information
// https://docs.directus.io/reference/sdk.html

export default defineNuxtPlugin(async (nuxtApp) => {
	const config = useRuntimeConfig();

	// Create a new instance of the SDK
	const directus = new Directus<Schema>(config.public.directusUrl, {
		auth: {
			staticToken: config.public.directusToken,
		},
	});

	// Inject the SDK into the Nuxt app
	// Can be accessed from anywhere in the app using $directus
	// Ex:
	// const { $directus } = useNuxtApp()
	//
	nuxtApp.provide('directus', directus);
});
