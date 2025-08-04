import { marketplaceClient, readItems, processExtension } from '~/layers/marketplace/server/utils/marketplace';
import { typesenseServer, ensureTypesenseCollection, recreateTypesenseCollection } from './typesense';
import type { MarketplaceExtension } from '~/types/marketplace';
import { consola } from 'consola';
import type { CollectionCreateSchema } from 'typesense/lib/Typesense/Collections';

const collectionName = 'directus-extensions';

export const extensionsSchema: CollectionCreateSchema = {
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

export async function fetchExtensions(): Promise<any[]> {
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

	// Return raw extensions, processing will be done in indexExtensions
	return extensions;
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

export async function indexExtensions(recreate = false, validateImages = false) {
	try {
		if (recreate) {
			await recreateTypesenseCollection(collectionName, extensionsSchema);
		} else {
			await ensureTypesenseCollection(collectionName, extensionsSchema);
		}

		const extensions = await fetchExtensions();

		// Process all extensions (with or without image validation)
		consola.info(`🔄 Processing ${extensions.length} extensions${validateImages ? ' with image validation' : ''}...`);

		const processedExtensions = await Promise.all(
			extensions.map(async (ext, index) => {
				if (validateImages && index % 50 === 0) {
					consola.info(`Progress: ${index + 1}/${extensions.length} extensions processed`);
				}

				return await processExtension(ext, validateImages, { timeout: 3000, concurrency: 3 });
			}),
		);

		consola.info(`✅ Processing complete${validateImages ? ' with image validation' : ''}`);

		// Transform processed extensions to documents
		const documents = processedExtensions.map((ext) => transformExtension(ext));

		if (documents.length === 0) {
			return { success: true, successCount: 0, failureCount: 0, failures: [], total: 0 };
		}

		try {
			const importResult = await typesenseServer
				.collections(collectionName)
				.documents()
				.import(documents, { action: 'upsert', return_id: true });

			const results = Array.isArray(importResult) ? importResult : [];

			const successCount = results.filter((result: any) => result.success === true).length;
			const failures = results.filter((result: any) => result.success === false);
			const failureCount = failures.length;

			return {
				success: failureCount === 0,
				successCount,
				failureCount,
				failures,
				total: documents.length,
			};
		} catch (importError: any) {
			const errorMessage = importError.message || 'Unknown import error';
			const importResults = importError.importResults || [];

			const successCount = importResults.filter((result: any) => result.success === true).length;
			const failures = importResults.filter((result: any) => result.success === false);
			const failureCount = failures.length;

			return {
				success: false,
				successCount,
				failureCount,
				failures,
				total: documents.length,
				error: errorMessage,
			};
		}
	} catch (error: any) {
		return {
			success: false,
			successCount: 0,
			failureCount: 0,
			failures: [],
			total: 0,
			error: error.message || 'Unknown error',
		};
	}
}
