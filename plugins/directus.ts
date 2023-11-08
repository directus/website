import { aggregate, authentication, createDirectus, readItem, readItems, readSingleton, rest } from '@directus/sdk';

import Queue from 'p-queue';
import type { Schema } from '~/types/schema';

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const queue = new Queue({ concurrency: 15, interval: 1000 });

export default defineNuxtPlugin((nuxtApp) => {
	const route = useRoute();
	const config = useRuntimeConfig();

	const { directusUrl } = config.public;

	const preview = route.query.preview && route.query.preview === 'true';
	const token = route.query.token as string | undefined;

	const directus = createDirectus<Schema>(directusUrl)
		.with(
			rest({
				onRequest: async (request) => {
					await queue.add(() => sleep(400));
					return request;
				},
			}),
		)
		.with(authentication());

	if (token) {
		directus.setToken(token);
	}

	if (preview && token) {
		nuxtApp.hook('page:finish', () => {
			refreshNuxtData();
		});
	}

	return { provide: { directus, readItem, readItems, readSingleton, aggregate } };
});
