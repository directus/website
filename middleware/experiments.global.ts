export default defineNuxtRouteMiddleware((to) => {
	const posthogFeatureFlagsPayload = useState<Record<string, boolean | string> | undefined>('ph-feature-flag-payloads');

	if (!posthogFeatureFlagsPayload.value) return;

	// Clone the Vue proxy object to a plain object
	const flags = Object.values(JSON.parse(JSON.stringify(posthogFeatureFlagsPayload.value)));

	let redirectTo;

	flags.some((flag: any) => {
		if (flag.experiment_type === 'page' && to.path === flag.control_path && flag.control_path !== flag.path) {
			redirectTo = flag.path;
			return true;
		}
	});

	if (redirectTo) {
		return navigateTo(redirectTo);
	}
});
