import { indexExtensions } from '~/layers/marketplace/server/services/extensions';
import { indexIntegrations } from '~/layers/marketplace/server/services/integrations';
import { indexTemplates } from '~/layers/marketplace/server/services/templates';
import { consola } from 'consola';
import { z } from 'zod/v4';

const indexers = {
	extensions: indexExtensions,
	integrations: indexIntegrations,
	templates: indexTemplates,
};

const validCollections = Object.keys(indexers);

const requestBodySchema = z.object({
	recreate: z.boolean('recreate parameter must be a boolean').default(false),
	validateImages: z.boolean('validateImages parameter must be a boolean').default(false),
});

export default defineEventHandler(async (event) => {
	const startTime = Date.now();
	const collection = getRouterParam(event, 'collection');

	// Validate collection parameter
	if (!collection || !validCollections.includes(collection)) {
		throw createError({
			statusCode: 400,
			statusMessage: `Invalid collection. Must be one of: ${validCollections.join(', ')}`,
		});
	}

	// Parse and validate request body
	const result = await readValidatedBody(event, (body) => requestBodySchema.safeParse(body));

	if (!result.success) {
		throw createError({
			statusCode: 400,
			statusMessage: 'Invalid request body',
			data: result.error.issues,
		});
	}

	const { recreate, validateImages } = result.data;

	consola.info(
		`[INDEXING] Starting indexing for collection: ${collection} (recreate: ${recreate}, validateImages: ${validateImages})`,
	);

	try {
		// Only extensions support image validation for now
		const result =
			collection === 'extensions'
				? await indexExtensions(recreate, validateImages)
				: await indexers[collection as keyof typeof indexers](recreate);

		const duration = Date.now() - startTime;

		consola.info(
			`[INDEXING] Completed indexing for ${collection} in ${duration}ms - Success: ${result.successCount}, Failures: ${result.failureCount}`,
		);

		return {
			collection,
			message: `Indexed ${result.successCount} ${collection} successfully. ${result.failureCount} failures.`,
			duration,
			...result,
		};
	} catch (error) {
		const duration = Date.now() - startTime;
		const errorMessage = error instanceof Error ? error.message : 'Unknown error';

		consola.error(`[INDEXING] Failed to index ${collection} after ${duration}ms:`, errorMessage);

		throw createError({
			statusCode: 500,
			statusMessage: `Failed to index ${collection}: ${errorMessage}`,
		});
	}
});
