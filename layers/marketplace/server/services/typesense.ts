import { Client } from 'typesense';
import type { CollectionCreateSchema } from 'typesense/lib/Typesense/Collections';
import { parseTypesenseUrl } from '~/layers/marketplace/utils/parse-typesense-url';

const config = useRuntimeConfig();
const { typesenseUrl } = config.public;
const { typesensePrivateApiKey } = config;

const typesenseNode = parseTypesenseUrl(typesenseUrl as string);

export const typesenseServer = new Client({
	nodes: [typesenseNode],
	apiKey: typesensePrivateApiKey,
	connectionTimeoutSeconds: 300,
});

export async function collectionExists(collectionName: string): Promise<boolean> {
	try {
		await typesenseServer.collections(collectionName).retrieve();
		return true;
	} catch {
		return false;
	}
}

export async function ensureTypesenseCollection(collectionName: string, schema: CollectionCreateSchema): Promise<void> {
	if (!(await collectionExists(collectionName))) {
		await typesenseServer.collections().create(schema);
	}
}

export async function recreateTypesenseCollection(
	collectionName: string,
	schema: CollectionCreateSchema,
): Promise<void> {
	try {
		await typesenseServer.collections(collectionName).delete();
	} catch {
		// Collection didn't exist, continue
	}

	await typesenseServer.collections().create(schema);
}
