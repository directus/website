import type { MarketplaceExtension } from '~/types/marketplace';
import { marketplaceClient, readItems, processExtension } from '~/server/utils/marketplace';

export default defineCachedEventHandler(
	async (event): Promise<MarketplaceExtension | null> => {
		const params = getRouterParam(event, 'idOrName');
		const extensionIdOrName = Array.isArray(params) ? params.join('/') : (params ?? '');

		if (!extensionIdOrName) {
			throw createError({
				statusCode: 400,
				statusMessage: 'Extension ID or name is required',
			});
		}

		const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(extensionIdOrName);

		const filter = isUuid ? { id: { _eq: extensionIdOrName } } : { name: { _eq: extensionIdOrName } };

		try {
			// Fetch individual extension directly by ID
			const [extension] = (await marketplaceClient.request(
				readItems('packages', {
					filter,
					fields: [
						'name',
						'description',
						'verified',
						'id',
						'readme',
						'type',
						'publisher.*',
						'last_updated',
						'host_version',
						'total_downloads',
						'sandbox',
						'license',
						'versions.*',
					],
				}),
			)) as MarketplaceExtension[];

			// Apply quality filter
			if (!extension.readme || extension.readme.trim().length === 0 || extension.total_downloads < 100) {
				throw createError({
					statusCode: 404,
					statusMessage: 'Extension not found',
				});
			}

			// Process extension (add image, etc.)
			return processExtension(extension);
		} catch (error: any) {
			// eslint-disable-next-line no-console
			console.error('Extension API error:', error);

			if (error.statusCode) {
				throw error;
			}

			throw createError({
				statusCode: 500,
				statusMessage: 'Failed to fetch extension',
			});
		}
	},
	{
		maxAge: 1000 * 60 * 15, // Cache for 15 minutes
		name: 'extension-detail',
		getKey: (event) => {
			const extensionId = getRouterParam(event, 'idOrName');
			return `extension-${extensionId}`;
		},
	},
);
