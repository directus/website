import { createDirectus, readItems, readItem, rest, staticToken } from '@directus/sdk';
import type { Schema } from '~/types/schema';

// Fetch the data from Directus
const directusUrl = process.env.DIRECTUS_URL as string;
const directusToken = process.env.DIRECTUS_TOKEN as string;

// eslint-disable-next-line
const directus = createDirectus<Schema>(directusUrl).with(staticToken(directusToken)).with(rest());

export { directus, readItems, readItem };
