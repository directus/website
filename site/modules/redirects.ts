/* eslint-disable no-console */

import { Directus } from '@directus/sdk';
import { defineNuxtModule, extendRouteRules } from '@nuxt/kit';

export type Redirect = {
	url_old: string;
	url_new: string;
	response_code: string | number;
};

export default defineNuxtModule({
	async setup(moduleOptions, nuxt) {
		const directusUrl = nuxt.options.runtimeConfig.public.directusUrl;
		const directusToken = nuxt.options.runtimeConfig.directusToken;

		if (!directusUrl) {
			console.warn('Missing directusUrl in runtimeConfig');
			return;
		}

		if (!directusToken) {
			console.warn('Missing directusToken in runtimeConfig');
			return;
		}

		const directus = new Directus(directusUrl, {
			auth: {
				staticToken: directusToken,
			},
		});

		const { data: redirects }: { data: Redirect[] } = await directus.items('redirects').readByQuery();

		for (const redirect of redirects) {
			// Ensure redirect code is an integer
			redirect.response_code = parseInt(redirect.response_code);
			// If the response code is not either 301 or 302, set it to 301

			if (redirect.response_code !== 301 || redirect.response_code !== 302) {
				redirect.response_code = 301;
			}

			// Add the redirect to the route rules
			// https://nuxt.com/docs/guide/concepts/rendering#route-rules

			extendRouteRules(redirect.url_old, {
				redirect: {
					to: redirect.url_new,
					statusCode: redirect.response_code,
				},
			});
		}

		// Log the redirects to the console
		console.log(`${redirects.length} redirects loaded`);

		for (const redirect of redirects) {
			console.log(`${redirect.response_code} - From: ${redirect.url_old} To:${redirect.url_new}`);
		}
	},
});
