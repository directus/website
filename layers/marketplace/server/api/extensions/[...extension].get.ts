import type { MarketplaceExtension } from '~/types/marketplace';
import { marketplaceClient, readItems, processExtension } from '~/layers/marketplace/server/utils/marketplace';
import { arrayToString } from '~/utils/arrayToString';

export default defineEventHandler(async (event): Promise<MarketplaceExtension | null> => {
	const params = getRouterParam(event, 'extension');

	const extensionIdOrName = arrayToString(params);

	if (!extensionIdOrName) {
		throw createError({
			statusCode: 400,
			statusMessage: 'Extension ID or name is required',
		});
	}

	const filter = isUuid(extensionIdOrName) ? { id: { _eq: extensionIdOrName } } : { name: { _eq: extensionIdOrName } };

	try {
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
					'downloads',
					'total_downloads',
					'sandbox',
					'license',
					'versions.*',
				],
			}),
		)) as MarketplaceExtension[];

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
});
