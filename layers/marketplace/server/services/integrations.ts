import { typesenseServer, ensureTypesenseCollection, recreateTypesenseCollection } from './typesense';
import type { MarketplaceIntegration } from '~/types/marketplace';
import type { CollectionCreateSchema } from 'typesense/lib/Typesense/Collections';

const collectionName = 'directus-integrations';

const config = useRuntimeConfig();
const { directusUrl } = config.public;

export const integrationsSchema: CollectionCreateSchema = {
	name: collectionName,
	enable_nested_fields: true,
	fields: [
		{ name: 'id', type: 'string' },
		{ name: 'name', type: 'string', sort: true },
		{ name: 'slug', type: 'string' },
		{ name: 'description', type: 'string', optional: true },
		{ name: 'category', type: 'string', facet: true },
		{ name: 'website', type: 'string', optional: true, index: false },
		{ name: 'logo', type: 'string', optional: true, index: false },
		{ name: 'content', type: 'string', optional: true },
		{ name: 'metadata', type: 'object', optional: true },
		{ name: 'extensions', type: 'string[]', optional: true },
		{ name: 'helpful_resources', type: 'object[]', optional: true, index: false },
	],
} as const;

export async function fetchIntegrations(): Promise<MarketplaceIntegration[]> {
	const response = await $fetch<{ data?: MarketplaceIntegration[] } | MarketplaceIntegration[]>(
		`${directusUrl}/items/integrations`,
		{
			query: {
				limit: -1,
				filter: {
					status: {
						_eq: 'published',
					},
				},
				fields: [
					'id',
					'name',
					'slug',
					'description',
					'category',
					'website',
					'logo',
					'content',
					'extensions',
					'helpful_resources',
					'metadata',
				],
			},
		},
	);

	const integrations = Array.isArray(response) ? response : (response as any)?.data || [];
	return integrations;
}

function transformIntegration(integration: MarketplaceIntegration) {
	return {
		id: integration.slug,
		name: integration.name,
		slug: integration.slug,
		description: integration.description || '',
		category: integration.category,
		company_website: integration.company_website,
		logo: integration.logo,
		content: integration.content || '',
		extensions: integration.extensions || [],
		helpful_resources: integration.helpful_resources || [],
	};
}

export async function indexIntegrations(recreate = false) {
	if (recreate) {
		await recreateTypesenseCollection(collectionName, integrationsSchema);
	} else {
		await ensureTypesenseCollection(collectionName, integrationsSchema);
	}

	const integrations = await fetchIntegrations();
	const documents = integrations.map((integration) => transformIntegration(integration));

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
