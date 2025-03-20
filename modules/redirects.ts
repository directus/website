import type { Schema } from '~/types/schema';
import { createDirectus, readItems, rest } from '@directus/sdk';
import { defineNuxtModule, extendRouteRules, logger } from '@nuxt/kit';

import { withoutTrailingSlash } from 'ufo';

export default defineNuxtModule({
	async setup(_moduleOptions, nuxt) {
		const directusUrl = nuxt.options.runtimeConfig.public.directusUrl as string | undefined;

		if (!directusUrl) {
			console.warn('Missing directusUrl in runtimeConfig');
			return;
		}

		const directus = createDirectus<Schema>(directusUrl).with(rest());

		const redirects = await directus.request(readItems('redirects'));

		for (const redirect of redirects) {
			let responseCode = redirect.response_code ? Number.parseInt(redirect.response_code) : 301;

			if (responseCode !== 301 && responseCode !== 302) {
				responseCode = 301;
			}

			// Add the redirect to the route rules
			// https://nuxt.com/docs/guide/concepts/rendering#route-rules

			extendRouteRules(withoutTrailingSlash(redirect.url_old), {
				redirect: {
					to: redirect.url_new,
					statusCode: responseCode as 301 | 302,
				},
			});
		}

		logger.info(`${redirects.length} redirects loaded`);

		for (const redirect of redirects) {
			logger.info(`${redirect.response_code} - From: ${redirect.url_old} To:${redirect.url_new}`);
		}
	},
});
