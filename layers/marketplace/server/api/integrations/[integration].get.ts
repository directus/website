import type { MarketplaceIntegration, MarketplaceExtension } from '~/types/marketplace';
import type { IntegrationExternalResource } from '~/types/schema/marketplace/integration-external-resource';
import { arrayToString } from '~/utils/arrayToString';
import { isUuid } from '~/layers/marketplace/server/utils/isUuid';
import { typesenseServer } from '~/layers/marketplace/server/services/typesense';
import { consola } from 'consola';

interface IntegrationWithExtensions extends MarketplaceIntegration {
	extensionDetails?: MarketplaceExtension[];
	external_resources?: IntegrationExternalResource[];
}

const config = useRuntimeConfig();
const { directusUrl } = config.public;

export default defineEventHandler(
	async (event): Promise<IntegrationWithExtensions> => {
		const params = getRouterParams(event);
		const idOrSlug = arrayToString(params.integration);
		const filter = isUuid(idOrSlug) ? { id: { _eq: idOrSlug } } : { slug: { _eq: idOrSlug } };

		if (!idOrSlug) {
			throw createError({
				statusCode: 400,
				statusMessage: 'Integration ID or slug is required!',
			});
		}

		try {
			const response = await $fetch<{ data?: MarketplaceIntegration[] } | MarketplaceIntegration[]>(
				`${directusUrl}/items/integrations`,
				{
					query: {
						fields: [
							'*',
							'external_resources.id',
							'external_resources.title',
							'external_resources.url',
							'external_resources.description',
							'external_resources.image',
							'external_resources.sort',
							'external_resources.status',
						],
						filter: {
							...filter,
							status: {
								_eq: 'published',
							},
						},
						deep: {
							external_resources: {
								_filter: {
									status: {
										_eq: 'published',
									},
								},
								_sort: ['sort'],
							},
						},
					},
				},
			);

			const integration = Array.isArray(response) ? response[0] : (response as any)?.data?.[0] || null;

			if (!integration) {
				throw createError({
					statusCode: 404,
					statusMessage: 'Integration not found',
				});
			}

			// Search for related extensions using Typesense if the integration has extensions
			let extensionDetails: MarketplaceExtension[] = [];

			if (integration.extensions && integration.extensions.length > 0) {
				try {
					const searchResults = await typesenseServer
						.collections('directus-extensions')
						.documents()
						.search({
							q: '*',
							query_by: 'name,description',
							filter_by: `name:=[${integration.extensions.map((ext: string) => `"${ext}"`).join(',')}]`,
							sort_by: 'total_downloads:desc',
							limit: 50,
						});

					extensionDetails = searchResults.hits?.map((hit: any) => hit.document) || [];
				} catch (typesenseError) {
					consola.warn('Failed to fetch extensions from Typesense:', typesenseError);
					// Continue without extensions rather than failing
				}
			}

			const externalResources: IntegrationExternalResource[] =
				integration.external_resources && Array.isArray(integration.external_resources)
					? integration.external_resources
					: [];

			return {
				...integration,
				extensionDetails,
				external_resources: externalResources,
			};
		} catch (error) {
			consola.error('Integration detail API error:', error);

			if ((error as any).statusCode) {
				throw error;
			}

			throw createError({
				statusCode: 500,
				statusMessage: 'Failed to fetch integration details',
			});
		}
	},
	// {
	// 	maxAge: 1000 * 60 * 5, // Cache for 5 minutes
	// 	name: 'integration-detail-api',
	// 	getKey: (event) => {
	// 		const params = getRouterParams(event);
	// 		const slug = Array.isArray(params.idOrName) ? params.idOrName.join('/') : params.idOrName;
	// 		return `integration-detail-${slug}`;
	// 	},
	// },
);
