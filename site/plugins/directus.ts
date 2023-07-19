import { createDirectus, rest, staticToken } from '@directus/sdk';
import type { Schema } from '~/types/schema';

export default defineNuxtPlugin(() => {
	const config = useRuntimeConfig();
	const { directusUrl, directusToken } = config.public;

	const directus = createDirectus<Schema>(directusUrl).with(staticToken(directusToken)).with(rest());

	return { provide: { directus } };
});
