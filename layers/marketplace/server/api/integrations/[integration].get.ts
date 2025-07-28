import type { MarketplaceIntegration, MarketplaceExtension } from '~/types/marketplace';
import { arrayToString } from '~/utils/arrayToString';
import { typesenseServer } from '~/layers/marketplace/server/services/typesense';

interface IntegrationWithExtensions extends MarketplaceIntegration {
	extensionDetails?: MarketplaceExtension[];
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
					params: {
						fields: ['*'],
						filter,
					},
				},
			);

			const integration = Array.isArray(response) ? response[0] : (response as any)?.data[0] || [];

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
					// eslint-disable-next-line no-console
					console.warn('Failed to fetch extensions from Typesense:', typesenseError);
					// Continue without extensions rather than failing
				}
			}

			return {
				...integration,
				extensionDetails,
			};
		} catch (error) {
			// eslint-disable-next-line no-console
			console.error('Integration detail API error:', error);

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
