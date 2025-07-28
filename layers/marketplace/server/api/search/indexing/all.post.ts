import { indexExtensions } from '~/layers/marketplace/server/services/extensions';
import { indexIntegrations } from '~/layers/marketplace/server/services/integrations';
import { indexTemplates } from '~/layers/marketplace/server/services/templates';

export default defineEventHandler(async (event) => {
	const body = await readBody(event);
	const { recreate = false } = body || {};

	try {
		const results = await Promise.allSettled([
			indexExtensions(recreate),
			indexIntegrations(recreate),
			indexTemplates(recreate),
		]);

		const summary = results.map((result, index) => {
			const collections = ['extensions', 'integrations', 'templates'];
			const collectionName = collections[index];

			if (result.status === 'fulfilled') {
				return { collection: collectionName, ...result.value };
			} else {
				return {
					collection: collectionName,
					success: false,
					error: result.reason?.message || 'Unknown error',
				};
			}
		});

		const totalSuccess = summary.reduce((acc, r) => acc + ('successCount' in r ? r.successCount : 0), 0);
		const totalFailures = summary.reduce((acc, r) => acc + ('failureCount' in r ? r.failureCount : 0), 0);

		return {
			success: results.every((r) => r.status === 'fulfilled'),
			message: `Indexed ${totalSuccess} items successfully across all collections. ${totalFailures} failures.`,
			results: summary,
		};
	} catch (error) {
		throw createError({
			statusCode: 500,
			statusMessage: `Failed to index all collections: ${error instanceof Error ? error.message : 'Unknown error'}`,
		});
	}
});
