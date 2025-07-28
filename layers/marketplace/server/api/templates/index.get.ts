import { typesenseServer } from '~/layers/marketplace/server/services/typesense';
import type { Template } from '~/types/marketplace';

const COLLECTION_NAME = 'directus-templates';

export default defineEventHandler(async (event) => {
	try {
		const query = getQuery(event);

		// Build search parameters
		const searchParams: any = {
			q: (query.q as string) || '*',
			query_by: 'name,description,content,framework',
			sort_by: query.sort || 'created_at:desc',
			page: parseInt(query.page as string) || 1,
			per_page: Math.min(parseInt(query.limit as string) || 24, 100),
			facet_by: 'use_cases,framework,payment_type,template_status,directus_plus,has_frontend,cloud_template',
		};

		// Add filters
		const filters: string[] = [];

		// Status filter - only show published templates
		filters.push('status:published');

		// Framework filter
		if (query.framework) {
			const frameworks = Array.isArray(query.framework) ? query.framework : [query.framework];
			filters.push(`framework:[${frameworks.map(f => `"${f}"`).join(',')}]`);
		}

		// Use cases filter
		if (query.use_cases) {
			const useCases = Array.isArray(query.use_cases) ? query.use_cases : [query.use_cases];
			filters.push(`use_cases:[${useCases.map(uc => `"${uc}"`).join(',')}]`);
		}

		// Payment type filter
		if (query.payment_type) {
			const paymentTypes = Array.isArray(query.payment_type) ? query.payment_type : [query.payment_type];
			filters.push(`payment_type:[${paymentTypes.map(pt => `"${pt}"`).join(',')}]`);
		}

		// Template status filter
		if (query.template_status) {
			const statuses = Array.isArray(query.template_status) ? query.template_status : [query.template_status];
			filters.push(`template_status:[${statuses.map(s => `"${s}"`).join(',')}]`);
		}

		// Boolean filters
		if (query.directus_plus !== undefined) {
			filters.push(`directus_plus:${query.directus_plus === 'true'}`);
		}

		if (query.has_frontend !== undefined) {
			filters.push(`has_frontend:${query.has_frontend === 'true'}`);
		}

		if (query.cloud_template !== undefined) {
			filters.push(`cloud_template:${query.cloud_template === 'true'}`);
		}

		if (filters.length > 0) {
			searchParams.filter_by = filters.join(' && ');
		}

		// Perform search
		const searchResult = await typesenseServer.collections(COLLECTION_NAME).documents().search(searchParams);

		// Transform results
		const templates = searchResult.hits?.map((hit: any) => {
			const template = hit.document;
			return {
				id: template.id,
				name: template.name,
				slug: template.slug,
				description: template.description,
				content: template.content,
				framework: template.framework,
				use_cases: template.use_cases,
				template_status: template.template_status,
				payment_type: template.payment_type,
				price: template.price,
				directus_plus: template.directus_plus,
				has_frontend: template.has_frontend,
				cloud_template: template.cloud_template,
				image: template.image,
				video_id: template.video_id,
				creator_id: template.creator_id,
				creator_name: template.creator_name,
				creator_slug: template.creator_slug,
				creator_verified: template.creator_verified,
				url_github_repository: template.url_github_repository,
				url_frontend_demo: template.url_frontend_demo,
				url_backend_demo: template.url_backend_demo,
				url_template: template.url_template,
				created_at: template.created_at,
				updated_at: template.updated_at,
			};
		}) || [];

		// Build facets
		const facets = searchResult.facet_counts?.map((facet: any) => ({
			field: facet.field_name,
			options: facet.counts?.map((count: any) => ({
				value: count.value,
				count: count.count,
			})) || [],
		})) || [];

		return {
			data: templates,
			meta: {
				total_count: searchResult.found || 0,
				filter_count: searchResult.found || 0,
				page: searchParams.page,
				per_page: searchParams.per_page,
				total_pages: Math.ceil((searchResult.found || 0) / searchParams.per_page),
			},
			facets,
		};
	} catch (error: any) {
		throw createError({
			statusCode: 500,
			statusMessage: `Failed to search templates: ${error.message}`,
		});
	}
});
