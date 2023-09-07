import { aggregate, createDirectus, readItem, readItems, readSingleton, rest } from '@directus/sdk';
import Queue from 'p-queue';
import type { Schema } from '~/types/schema';

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const queue = new Queue({ concurrency: 15, interval: 1000 });

export default defineNuxtPlugin(() => {
	const config = useRuntimeConfig();
	const { directusUrl } = config.public;

	const directus = createDirectus<Schema>(directusUrl).with(
		rest({
			onRequest: async (request) => {
				await queue.add(() => sleep(400));
				return request;
			},
		})
	);

	return { provide: { directus, readItem, readItems, readSingleton, aggregate } };
});
