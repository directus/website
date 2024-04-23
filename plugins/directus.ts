import { aggregate, authentication, createDirectus, readItem, readItems, readSingleton, rest } from '@directus/sdk';
import Queue from 'p-queue';

import type { Schema } from '~/types/schema';

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const queue = new Queue({ intervalCap: 10, interval: 1000, carryoverConcurrencyCount: true });

export default defineNuxtPlugin((nuxtApp) => {
	const route = useRoute();
	const config = useRuntimeConfig();

	const { directusUrl } = config.public;

	const preview = route.query.preview && route.query.preview === 'true';
	const token = route.query.token as string | undefined;

	const directus = createDirectus<Schema>(directusUrl, {
		globals: {
			// @ts-ignore
			fetch: (...args) => queue.add(() => fetchRetry(0, ...args)),
		},
	})
		.with(rest())
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

async function fetchRetry(count: number, ...args: Parameters<typeof fetch>) {
	const response = await fetch(...args);

	if (count > 2 || response.status !== 429) return response;

	// eslint-disable-next-line no-console
	console.warn(`[429] Too Many Requests (Attempt ${count + 1})`);

	// Try again after interval / 2
	await sleep(500);

	return fetchRetry(count + 1, ...args);
}
