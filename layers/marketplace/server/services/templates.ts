import { typesenseServer, ensureTypesenseCollection, recreateTypesenseCollection } from './typesense';
import type { MarketplaceTemplate } from '~/types/marketplace';
import type { CollectionCreateSchema } from 'typesense/lib/Typesense/Collections';

const collectionName = 'directus-templates';

const config = useRuntimeConfig();
const { directusUrl } = config.public;

export const templatesSchema: CollectionCreateSchema = {
	name: collectionName,
	enable_nested_fields: true,
	fields: [
		{ name: 'id', type: 'string' },
		{ name: 'name', type: 'string', sort: true },
		{ name: 'slug', type: 'string' },
		{ name: 'description', type: 'string', optional: true },
		{ name: 'content', type: 'string', optional: true },
		{ name: 'instructions', type: 'string', optional: true },
		{ name: 'status', type: 'string', facet: true, optional: true },
		{ name: 'template_status', type: 'string', facet: true, optional: true },
		{ name: 'use_cases', type: 'string[]', facet: true, optional: true },
		{ name: 'framework', type: 'string', facet: true, optional: true },
		{ name: 'url_github_repository', type: 'string', optional: true, index: false },
		{ name: 'url_frontend_demo', type: 'string', optional: true, index: false },
		{ name: 'url_backend_demo', type: 'string', optional: true, index: false },
		{ name: 'url_template', type: 'string', optional: true, index: false },
		{ name: 'image', type: 'string', optional: true, index: false },
		{ name: 'creator', type: 'object', optional: true },
		{ name: 'payment_type', type: 'string', facet: true, optional: true },
		{ name: 'price', type: 'float', optional: true, sort: true },
		{ name: 'directus_plus', type: 'bool', optional: true, facet: true },
		{ name: 'has_frontend', type: 'bool', optional: true, facet: true },
		{ name: 'cloud_template', type: 'bool', optional: true, facet: true },
		{ name: 'created_at', type: 'int64', sort: true },
		{ name: 'updated_at', type: 'int64', sort: true },
		{ name: 'sort', type: 'int32', optional: true, sort: true },
	],
} as const;

export async function fetchTemplates(): Promise<MarketplaceTemplate[]> {
	const response = await $fetch<{ data?: MarketplaceTemplate[] } | MarketplaceTemplate[]>(
		`${directusUrl}/items/templates`,
		{
			query: {
				limit: -1, // Get all
				fields: ['*', 'creator.id', 'creator.first_name', 'creator.last_name', 'creator.slug', 'creator.verified'],
			},
		},
	);

	const templates = Array.isArray(response) ? response : (response as any)?.data || [];
	return templates;
}

function transformTemplate(template: MarketplaceTemplate) {
	const creator = typeof template.creator === 'object' ? template.creator : null;
	const video = typeof template.video === 'object' ? template.video : null;
	const image = typeof template.image === 'object' ? template.image : null;

	return {
		id: template.id,
		name: template.name || '',
		slug: template.slug || '',
		description: template.description || '',
		content: template.content || '',
		instructions: template.instructions || '',
		status: template.status || 'draft',
		template_status: template.template_status || 'request',
		use_cases: template.use_cases || [],
		framework: template.framework || '',
		url_github_repository: template.url_github_repository || '',
		url_frontend_demo: template.url_frontend_demo || '',
		url_backend_demo: template.url_backend_demo || '',
		url_template: template.url_template || '',
		image: typeof template.image === 'string' ? template.image : image?.id || '',
		video_id: typeof template.video === 'string' ? template.video : video?.id || '',
		creator_id: creator?.id || '',
		creator_name: creator ? `${creator.first_name || ''} ${creator.last_name || ''}`.trim() : '',
		creator_slug: creator?.slug || '',
		creator_verified: creator?.verified || false,
		payment_type: template.payment_type || 'free',
		price: template.price || 0,
		directus_plus: template.directus_plus || false,
		has_frontend: template.has_frontend || false,
		cloud_template: template.cloud_template || false,
		created_at: template.date_created ? Math.floor(new Date(template.date_created).getTime() / 1000) : 0,
		updated_at: template.date_updated ? Math.floor(new Date(template.date_updated).getTime() / 1000) : 0,
		sort: template.sort || 0,
	};
}

export async function indexTemplates(recreate = false) {
	try {
		if (recreate) {
			await recreateTypesenseCollection(collectionName, templatesSchema);
		} else {
			await ensureTypesenseCollection(collectionName, templatesSchema);
		}

		const templates = await fetchTemplates();
		const documents = templates.map((template) => transformTemplate(template));

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
