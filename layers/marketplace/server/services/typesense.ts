import { Client } from 'typesense';
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

export async function ensureTypesenseCollection(collectionName: string, schema: any) {
	try {
		await typesenseServer.collections(collectionName).retrieve();
	} catch (error) {
		await typesenseServer.collections().create(schema as any);
	}
}

export async function recreateTypesenseCollection(collectionName: string, schema: any) {
	try {
		await typesenseServer.collections(collectionName).delete();
	} catch (error) {
		// Collection didn't exist, no problem
	}

	await typesenseServer.collections().create(schema as any);
}
