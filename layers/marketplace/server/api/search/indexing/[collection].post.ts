import { indexExtensions } from '~/layers/marketplace/server/services/extensions';
import { indexIntegrations } from '~/layers/marketplace/server/services/integrations';
import { indexTemplates } from '~/layers/marketplace/server/services/templates';

const indexers = {
	extensions: indexExtensions,
	integrations: indexIntegrations,
	templates: indexTemplates,
};

export default defineEventHandler(async (event) => {
	const body = await readBody(event);
	const collection = getRouterParam(event, 'collection');
	const { recreate = false } = body || {};

	try {
		const result = await indexers[collection as keyof typeof indexers](recreate);

		return {
			message: `Indexed ${result.successCount} ${collection} successfully. ${result.failureCount} failures.`,
			...result,
		};
	} catch (error) {
		throw createError({
			statusCode: 500,
			statusMessage: `Failed to index ${collection}: ${error instanceof Error ? error.message : 'Unknown error'}`,
		});
	}
});
