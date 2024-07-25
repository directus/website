import type { FeatureFlagPayload } from '~/types/schema';

export default defineNuxtRouteMiddleware((to) => {
	const posthogFeatureFlagsPayload = useState<{
		[key: string]: FeatureFlagPayload;
	}>('ph-feature-flag-payloads');

	if (!posthogFeatureFlagsPayload.value) return;

	// Clone the Vue proxy object to a plain object so we can iterate over it
	const flags: FeatureFlagPayload[] = Object.values(JSON.parse(JSON.stringify(posthogFeatureFlagsPayload.value)));

	let redirectTo;

	flags.some((flag) => {
		if (flag.experiment_type === 'page' && to.path === flag.control_path && flag.control_path !== flag.path) {
			redirectTo = flag.path;
			return true;
		}
	});

	if (redirectTo) {
		return navigateTo(redirectTo);
	}
});
