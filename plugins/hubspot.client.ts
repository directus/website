declare global {
	interface Window {
		_hsq: [string, unknown?][];
	}
}

export default defineNuxtPlugin(() => {
	const router = useRouter();

	router.afterEach((to, from) => {
		if (to.path !== from.path) {
			const _hsq = (window._hsq = window._hsq || []);
			_hsq.push(['setPath', to.fullPath]);
			_hsq.push(['trackPageView']);
		}
	});
});
