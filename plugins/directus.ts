import { createDirectus, readItem, readItems, readSingleton, rest, staticToken } from '@directus/sdk';
import Queue from 'p-queue';
import type { Schema } from '~/types/schema';

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const queue = new Queue({ concurrency: 10, interval: 1000 });

export default defineNuxtPlugin(() => {
	const config = useRuntimeConfig();
	const { directusUrl, directusToken } = config.public;

	const directus = createDirectus<Schema>(directusUrl)
		.with(staticToken(directusToken))
		.with(
			rest({
				onRequest: async (request) => {
					await queue.add(() => sleep(500));
					return request;
				},
			})
		);

	return { provide: { directus, readItem, readItems, readSingleton } };
});
