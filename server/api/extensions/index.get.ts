import { z } from 'zod';
import type { MarketplaceExtension, MarketplaceResponse } from '~/types/marketplace';
import { marketplaceClient, readItems, marketplaceFields, processExtension } from '~/server/utils/marketplace';

const querySchema = z.object({
	limit: z.coerce.number().min(1).max(100).default(20),
	page: z.coerce.number().min(1).default(1),
	search: z.string().optional(),
	type: z.string().optional(),
});

// Cached function to fetch all extensions
export const fetchAllExtensions = defineCachedFunction(
	async (): Promise<MarketplaceExtension[]> => {
		let allExtensions: MarketplaceExtension[] = [];
		let offset = 0;
		const limit = 50;
		let hasMore = true;

		while (hasMore) {
			const response = await marketplaceClient.request(
				readItems('packages', {
					fields: marketplaceFields,
					limit,
					offset,
					// Pre-filter at the database level for performance
					filter: {
						total_downloads: { _gte: 100 },
						readme: { _nnull: true },
					},
					sort: ['-total_downloads'], // Sort by downloads descending
				}),
			);

			if (response.length === 0) {
				hasMore = false;
			} else {
				allExtensions = allExtensions.concat(response as MarketplaceExtension[]);
				offset += limit;
				hasMore = response.length === limit;
			}
		}

		return allExtensions.map(processExtension);
	},
	{
		maxAge: 1000 * 60 * 10, // Cache for 10 minutes
		name: 'marketplace-extensions',
		getKey: () => 'all-extensions',
	},
);

export default defineCachedEventHandler(
	async (event): Promise<MarketplaceResponse> => {
		const query = await getValidatedQuery(event, querySchema.safeParse);

		if (!query.success) {
			throw createError({ statusCode: 400, statusMessage: 'Invalid query parameters' });
		}

		const { limit, page, search, type } = query.data;

		try {
			// Fetch all extensions from cache
			const allExtensions = await fetchAllExtensions();
			let filteredExtensions = allExtensions;

			// Apply search filter if provided
			if (search) {
				const searchLower = search.toLowerCase();

				filteredExtensions = filteredExtensions.filter(
					(extension) =>
						extension.name.toLowerCase().includes(searchLower) ||
						extension.description.toLowerCase().includes(searchLower) ||
						extension.publisher.username.toLowerCase().includes(searchLower),
				);
			}

			// Apply type filter if provided
			if (type) {
				filteredExtensions = filteredExtensions.filter((extension) => extension.type === type);
			}

			// Calculate pagination
			const totalCount = filteredExtensions.length;
			const startIndex = (page - 1) * limit;
			const endIndex = startIndex + limit;
			const paginatedExtensions = filteredExtensions.slice(startIndex, endIndex);

			return {
				data: paginatedExtensions,
				meta: {
					total_count: allExtensions.length,
					filter_count: totalCount,
				},
			};
		} catch (error) {
			// eslint-disable-next-line no-console
			console.error('Extensions API error:', error);

			throw createError({
				statusCode: 500,
				statusMessage: 'Failed to fetch extensions',
			});
		}
	},
	{
		maxAge: 1000 * 60 * 5, // Cache for 5 minutes
		name: 'extensions-api',
		getKey: (event) => {
			const query = getQuery(event);
			return `${query.page || 1}-${query.limit || 20}-${query.search || ''}-${query.type || ''}`;
		},
	},
);
