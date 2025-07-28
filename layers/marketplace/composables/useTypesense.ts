// @ts-expect-error Typesense instantsearch adapter does not export types
import TypesenseInstantSearchAdapter from 'typesense-instantsearch-adapter';

export function useTypesense(searchConfig: any) {
	const config = useRuntimeConfig();
	const { typesenseUrl, typesensePublicApiKey } = config.public;

	const typesenseNode = computed(() => parseTypesenseUrl(typesenseUrl));

	const typesenseInstantsearchAdapter = new TypesenseInstantSearchAdapter({
		server: {
			apiKey: typesensePublicApiKey,
			nodes: [typesenseNode.value],
			cacheSearchResultsForSeconds: 2 * 60,
		},
		additionalSearchParameters: {
			query_by: searchConfig.query_by,
			facet_by: searchConfig.facet_by,
			sort_by: searchConfig.sort_by,
			filter_by: searchConfig.filter_by,
		},
		future: {
			preserveSharedStateOnUnmount: true,
		},
	});

	const searchClient = typesenseInstantsearchAdapter.searchClient;

	return {
		searchClient,
		typesenseNode,
	};
}
