import type { JsonType } from 'posthog-js';

export default defineNuxtRouteMiddleware((to) => {
	const posthogFeatureFlagsPayload = useState<Record<string, JsonType> | undefined>('ph-feature-flag-payloads');

	if (!posthogFeatureFlagsPayload.value) return;

	// Clone the Vue proxy object to a plain object
	const payloads = JSON.parse(JSON.stringify(posthogFeatureFlagsPayload.value));

	let redirectTo;

	// Iterate over payload entries (flagName -> payload)
	Object.entries(payloads).some(([_flagName, payload]: [string, any]) => {
		if (
			payload?.experiment_type === 'page' &&
			to.path === payload?.control_path &&
			payload?.control_path !== payload?.path
		) {
			redirectTo = payload.path;
			return true;
		}
	});

	if (redirectTo) {
		return navigateTo(redirectTo);
	}
});
