import { ref, computed, watch } from 'vue';
import Fuse from 'fuse.js';

interface DirectoryItem {
	[key: string]: any;
}

interface FacetOption {
	value: string;
	count: number;
}

interface Facet {
	field: string;
	options: FacetOption[];
}

interface FieldMapping {
	[key: string]: string | any;
}

interface UseDirectoryOptions {
	items: DirectoryItem[];
	searchFields: string[];
	facetFields: string[];
	fieldMapping?: FieldMapping | undefined;
}

export function useDirectory({ items, searchFields, facetFields, fieldMapping = {} }: UseDirectoryOptions) {
	const route = useRoute();
	const router = useRouter();

	const searchQuery = ref('');
	const selectedFacets = ref<Record<string, string[]>>(Object.fromEntries(facetFields.map((field) => [field, []])));

	const fuse = new Fuse(items, {
		keys: searchFields,
		threshold: 0.3,
	});

	// Helpers for syncing state with URL
	const updateURL = () => {
		const query: Record<string, string> = {};

		if (searchQuery.value) {
			query.q = searchQuery.value;
		}

		Object.entries(selectedFacets.value).forEach(([field, values]) => {
			if (values.length > 0) {
				query[field] = values.join(',');
			}
		});

		router.replace({ query });
	};

	const readFromURL = () => {
		const { q, ...facetParams } = route.query;

		searchQuery.value = (q as string) || '';

		Object.keys(selectedFacets.value).forEach((field) => {
			const param = facetParams[field] as string | undefined;
			selectedFacets.value[field] = param ? param.split(',') : [];
		});
	};

	readFromURL();

	watch([searchQuery, selectedFacets], updateURL, { deep: true });

	const facets = computed(() => {
		return facetFields.map((field) => {
			const options = items.reduce(
				(acc, item) => {
					const values = Array.isArray(item[field]) ? item[field] : [item[field]];

					values.forEach((value: any) => {
						if (value) {
							if (!acc[value]) {
								acc[value] = { value, count: 0 };
							}

							acc[value].count++;
						}
					});

					return acc;
				},
				{} as Record<string, FacetOption>,
			);

			return {
				field,
				options: Object.values(options).sort((a, b) => b.count - a.count),
			};
		});
	});

	const filterItemsByFacets = (items: DirectoryItem[]) => {
		return items.filter((item) => {
			return Object.entries(selectedFacets.value).every(([field, values]) => {
				if (values.length === 0) return true;
				const itemValues = Array.isArray(item[field]) ? item[field] : [item[field]];
				return itemValues.some((v: any) => values.includes(v));
			});
		});
	};

	const applyFieldMapping = (item: DirectoryItem) => {
		return Object.entries(fieldMapping).reduce((mappedItem, [uiProp, sourceField]) => {
			if (typeof sourceField === 'function') {
				mappedItem[uiProp] = sourceField(item);
			} else {
				mappedItem[uiProp] = item[sourceField];
			}

			return mappedItem;
		}, {} as DirectoryItem);
	};

	const filteredItems = computed(() => {
		let result = items;

		result = filterItemsByFacets(result);

		if (searchQuery.value) {
			result = fuse.search(searchQuery.value).map((res) => res.item);
		}

		return result.map(applyFieldMapping);
	});

	const isFilterActive = computed(() => {
		return searchQuery.value || facetFields.some((field) => selectedFacets.value[field].length > 0);
	});

	const updateFacet = (field: string, value: string, isSelected: boolean) => {
		if (isSelected) {
			selectedFacets.value[field].push(value);
		} else {
			selectedFacets.value[field] = selectedFacets.value[field].filter((v) => v !== value);
		}
	};

	const clearFilters = () => {
		searchQuery.value = '';

		Object.keys(selectedFacets.value).forEach((field) => {
			selectedFacets.value[field] = [];
		});
	};

	return {
		searchQuery,
		selectedFacets,
		facets,
		filteredItems,
		updateFacet,
		clearFilters,
		isFilterActive,
	};
}
