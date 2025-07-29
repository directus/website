type PageLayout = 'default' | 'marketplace';

export default function usePageLayout() {
	const route = useRoute();

	const marketplaceRoutes = /^\/(extensions|templates|integrations)/;

	const pageLayout = computed<PageLayout>(() => {
		return marketplaceRoutes.test(route.path) ? 'marketplace' : 'default';
	});

	return { pageLayout };
}
