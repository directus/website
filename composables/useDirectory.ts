import Fuse from 'fuse.js';
import { computed, ref, watch } from 'vue';

interface DirectoryItem {
	[key: string]: any;
}

interface FacetOption {
	value: string;
	count: number;
}

interface FieldMapping {
	[key: string]: string | any;
}

interface UseDirectoryOptions {
	items: DirectoryItem[];
	searchFields: string[];
	facetFields: string[];
	fieldMapping?: FieldMapping | undefined;
	groupBy?: string;
}

export function useDirectory({ items, searchFields, facetFields, fieldMapping = {}, groupBy }: UseDirectoryOptions) {
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

		for (const [field, values] of Object.entries(selectedFacets.value)) {
			if (values.length > 0) {
				query[field] = values.join(',');
			}
		}

		router.replace({ query });
	};

	const readFromURL = () => {
		const { q, ...facetParams } = route.query;
		searchQuery.value = (q as string) || '';

		for (const field of Object.keys(selectedFacets.value)) {
			const param = facetParams[field] as string | undefined;
			selectedFacets.value[field] = param ? param.split(',') : [];
		}
	};

	readFromURL();
	watch([searchQuery, selectedFacets], updateURL, { deep: true });

	const facets = computed(() => {
		return facetFields.map((field) => {
			const options = items.reduce(
				(acc, item) => {
					const values = Array.isArray(item[field]) ? item[field] : [item[field]];

					for (const value of values) {
						if (value) {
							if (!acc[value]) {
								acc[value] = { value, count: 0 };
							}

							acc[value].count++;
						}
					}

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
			mappedItem[uiProp] = typeof sourceField === 'function' ? sourceField(item) : item[sourceField];

			return mappedItem;
		}, {} as DirectoryItem);
	};

	const groupItems = (items: DirectoryItem[]) => {
		if (!groupBy) return items;

		return items.reduce(
			(acc, item) => {
				const groupValue = item[groupBy];

				if (!acc[groupValue]) {
					acc[groupValue] = [];
				}

				acc[groupValue].push(item);
				return acc;
			},
			{} as Record<string, DirectoryItem[]>,
		);
	};

	const filteredItems = computed(() => {
		let result = items;
		result = filterItemsByFacets(result);

		if (searchQuery.value) {
			result = fuse.search(searchQuery.value).map((res) => res.item);
		}

		const mappedResult = result.map((item) => applyFieldMapping(item));
		return groupBy ? groupItems(mappedResult) : mappedResult;
	});

	const isFilterActive = computed(() => {
		return searchQuery.value || facetFields.some((field) => selectedFacets.value[field].length > 0);
	});

	const updateFacet = (field: string, value: string, isSelected: boolean) => {
		if (isSelected) {
			selectedFacets.value[field].push(value);
		}
		else {
			selectedFacets.value[field] = selectedFacets.value[field].filter((v) => v !== value);
		}
	};

	const clearFilters = () => {
		searchQuery.value = '';

		for (const field of Object.keys(selectedFacets.value)) {
			selectedFacets.value[field] = [];
		}
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
