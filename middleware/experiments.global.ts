import type { JsonType } from 'posthog-js';

export default defineNuxtRouteMiddleware((to) => {
	const posthogFeatureFlagPayloads = useState<Record<string, JsonType> | undefined>('ph-feature-flag-payloads');

	if (!posthogFeatureFlagPayloads.value) return;

	// Clone the Vue proxy object to a plain object
	const payloads = JSON.parse(JSON.stringify(posthogFeatureFlagPayloads.value));

	let redirectTo;

	// Iterate over payload entries (flagName -> payload)
	Object.entries(payloads).some(([_flagName, payload]) => {
		if (
			payload &&
			typeof payload === 'object' &&
			!Array.isArray(payload) &&
			'experiment_type' in payload &&
			'control_path' in payload &&
			'path' in payload
		) {
			const expPayload = payload as { experiment_type: string; control_path: string; path: string };

			if (
				expPayload.experiment_type === 'page' &&
				to.path === expPayload.control_path &&
				expPayload.control_path !== expPayload.path
			) {
				redirectTo = expPayload.path;
				return true;
			}
		}
	});

	if (redirectTo) {
		return navigateTo(redirectTo);
	}
});
