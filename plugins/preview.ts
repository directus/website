export default defineNuxtPlugin((nuxtApp) => {
	const route = useRoute();
	const preview = route.query.preview && route.query.preview === 'true';

	if (preview) {
		nuxtApp.hook('page:finish', () => {
			refreshNuxtData();
		});
	}

	return { provide: { preview } };
});
