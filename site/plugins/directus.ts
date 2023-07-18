import { createDirectus, rest, staticToken } from '@directus/sdk';
import type { Schema } from '~/types/schema';

export default defineNuxtPlugin(() => {
	const { directusUrl, directusToken } = useRuntimeConfig();

	const directus = createDirectus<Schema>(directusUrl).with(staticToken(directusToken)).with(rest());

	return { provide: { directus } };
});
