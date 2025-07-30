import { indexExtensions } from '~/layers/marketplace/server/services/extensions';
import { indexIntegrations } from '~/layers/marketplace/server/services/integrations';
import { indexTemplates } from '~/layers/marketplace/server/services/templates';
import { consola } from 'consola';
import { z } from 'zod/v4';

const requestBodySchema = z.object({
	recreate: z.boolean('recreate parameter must be a boolean').default(false),
	validateImages: z.boolean('validateImages parameter must be a boolean').default(false),
});

export default defineEventHandler(async (event) => {
	const startTime = Date.now();

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
		`[INDEXING] Starting indexing for all collections (recreate: ${recreate}, validateImages: ${validateImages})`,
	);

	try {
		const results = await Promise.allSettled([
			indexExtensions(recreate, validateImages),
			indexIntegrations(recreate),
			indexTemplates(recreate),
		]);

		const summary = results.map((result, index) => {
			const collections = ['extensions', 'integrations', 'templates'];
			const collectionName = collections[index];

			if (result.status === 'fulfilled') {
				return {
					collection: collectionName,
					...result.value,
				};
			} else {
				return {
					collection: collectionName,
					success: false,
					successCount: 0,
					failureCount: 0,
					error: result.reason?.message || 'Unknown error',
				};
			}
		});

		const totalSuccess = summary.reduce((acc, r) => acc + (r.successCount || 0), 0);
		const totalFailures = summary.reduce((acc, r) => acc + (r.failureCount || 0), 0);
		const duration = Date.now() - startTime;
		const overallSuccess = results.every((r) => r.status === 'fulfilled');

		consola.info(
			`[INDEXING] Completed indexing all collections in ${duration}ms - Success: ${totalSuccess}, Failures: ${totalFailures}`,
		);

		return {
			success: overallSuccess,
			message: `Indexed ${totalSuccess} items successfully across all collections. ${totalFailures} failures.`,
			duration,
			totalSuccess,
			totalFailures,
			results: summary,
		};
	} catch (error) {
		const duration = Date.now() - startTime;
		const errorMessage = error instanceof Error ? error.message : 'Unknown error';

		consola.error(`[INDEXING] Failed to index all collections after ${duration}ms:`, errorMessage);

		throw createError({
			statusCode: 500,
			statusMessage: `Failed to index all collections: ${errorMessage}`,
		});
	}
});
