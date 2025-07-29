import { marketplaceClient, readItems, processExtension } from '~/layers/marketplace/server/utils/marketplace';
import { typesenseServer, ensureTypesenseCollection, recreateTypesenseCollection } from './typesense';
import type { MarketplaceExtension } from '~/types/marketplace';

const collectionName = 'directus-extensions';

export const extensionsSchema = {
	name: collectionName,
	enable_nested_fields: true,
	fields: [
		{ name: 'id', type: 'string' },
		{ name: 'name', type: 'string', sort: true },
		{ name: 'formatted_name', type: 'string', sort: true },
		{ name: 'description', type: 'string', optional: true },
		{ name: 'readme', type: 'string', optional: true },
		{ name: 'type', type: 'string', facet: true },
		{ name: 'publisher', type: 'object', optional: true },
		{ name: 'last_updated', type: 'int64', facet: true, sort: true },
		{ name: 'published_at', type: 'int64', sort: true },
		{ name: 'host_version', type: 'string', facet: true },
		{ name: 'recent_downloads_7_days', type: 'int64', facet: true, sort: true },
		{ name: 'recent_downloads_30_days', type: 'int64', facet: true, sort: true },
		{ name: 'total_downloads', type: 'int64', facet: true, sort: true },
		{ name: 'sandbox', type: 'bool', facet: true, optional: true },
		{ name: 'license', type: 'string', facet: true, optional: true },
		{ name: 'featured_image', type: 'string', optional: true, index: false },
		{ name: 'images', type: 'string[]', optional: true, index: false },
		{ name: 'repository_url', type: 'string', optional: true, index: false },
	],
} as const;

export async function fetchExtensions(): Promise<MarketplaceExtension[]> {
	const extensions = [];
	let offset = 0;
	const batchSize = 100;
	let hasMore = true;

	while (hasMore) {
		const batch = await marketplaceClient.request(
			readItems('packages', {
				filter: {
					total_downloads: { _gte: 100 },
					readme: { _nnull: true },
				},
				fields: [
					'id',
					'name',
					'description',
					'verified',
					'readme',
					'type',
					'publisher.*',
					'last_updated',
					'host_version',
					'downloads',
					'total_downloads',
					'sandbox',
					'license',
					'versions.*',
				],
				limit: batchSize,
				offset,
			}),
		);

		extensions.push(...batch);

		if (batch.length < batchSize) {
			hasMore = false;
		} else {
			offset += batchSize;
		}
	}

	return extensions.map((ext: any) => processExtension(ext));
}

function transformExtension(extension: MarketplaceExtension) {
	return {
		id: extension.id,
		name: extension.name,
		formatted_name: extension.formatted_name || extension.name,
		description: extension.description || '',
		formatted_description: extension.formatted_description || '',
		readme: extension.readme || '',
		type: extension.type,
		publisher: extension.publisher,
		last_updated: Math.floor(new Date(extension.last_updated).getTime() / 1000),
		published_at: Math.floor(
			new Date(extension.versions?.[0]?.publish_date || extension.last_updated).getTime() / 1000,
		),
		host_version: extension.host_version,
		recent_downloads_7_days: extension.recent_downloads_7_days || 0,
		recent_downloads_30_days: extension.recent_downloads_30_days || 0,
		total_downloads: extension.total_downloads || 0,
		sandbox: extension.sandbox,
		license: extension.license,
		featured_image: extension.featured_image,
		images: extension.images || [],
		repository_url: extension.repository_url,
	};
}

export async function indexExtensions(recreate = false) {
	if (recreate) {
		await recreateTypesenseCollection(collectionName, extensionsSchema);
	} else {
		await ensureTypesenseCollection(collectionName, extensionsSchema);
	}

	const extensions = await fetchExtensions();
	const documents = extensions.map((ext) => transformExtension(ext));

	if (documents.length === 0) {
		return { success: true, successCount: 0, failureCount: 0, failures: [], total: 0 };
	}

	const importResult = await typesenseServer
		.collections(collectionName)
		.documents()
		.import(documents, { action: 'upsert' });

	const successCount = importResult.filter((result) => result.success).length;
	const failureCount = importResult.filter((result) => !result.success).length;
	const failures = importResult.filter((result) => !result.success);

	return {
		success: failureCount === 0,
		successCount,
		failureCount,
		failures,
		total: documents.length,
	};
}
