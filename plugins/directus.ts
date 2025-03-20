import type { RestClient } from '@directus/sdk';
import type { Schema } from '~/types/schema';
import { aggregate, authentication, createDirectus, readItem, readItems, readSingleton, rest } from '@directus/sdk';

import Queue from 'p-queue';

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const queue = new Queue({ intervalCap: 10, interval: 500, carryoverConcurrencyCount: true });

export default defineNuxtPlugin((nuxtApp) => {
	const route = useRoute();
	const config = useRuntimeConfig();

	const { directusUrl } = config.public;

	const preview = route.query.preview && route.query.preview === 'true';
	const token = route.query.token as string | undefined;

	const directus = createDirectus<Schema>(directusUrl as string, {
		globals: {
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

	return {
		provide: {
			directus: directus as RestClient<Schema>,
			readItem,
			readItems,
			readSingleton,
			aggregate,
		},
	};
});

async function fetchRetry(count: number, ...args: Parameters<typeof fetch>) {
	const response = await fetch(...args);

	if (count > 2 || response.status !== 429) return response;

	console.warn(`[429] Too Many Requests (Attempt ${count + 1})`);

	// Try again after interval / 2
	await sleep(500);

	return fetchRetry(count + 1, ...args);
}

// Needed for vue-tsc 2.x to work properly with Nuxt
declare module '#app' {
	interface NuxtApp {
		$directus: RestClient<Schema>;
		$readItem: typeof readItem;
		$readItems: typeof readItems;
		$readSingleton: typeof readSingleton;
		$aggregate: typeof aggregate;
	}
}

declare module '@vue/runtime-core' {
	interface ComponentCustomProperties {
		$directus: RestClient<Schema>;
		$readItem: typeof readItem;
		$readItems: typeof readItems;
		$readSingleton: typeof readSingleton;
		$aggregate: typeof aggregate;
	}
}
