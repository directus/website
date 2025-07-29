import { watch, type Ref, onUnmounted } from 'vue';
import type { SearchState, SortOption, FilterAttribute } from './useTypesenseSearch';

interface UseSearchURLStateOptions {
	state: Ref<SearchState>;
	indexName: string;
	sortOptions: SortOption[];
	filterAttributes: FilterAttribute[];
	onStateChange: (newState: Partial<SearchState>) => void;
}

export function useSearchURLState(options: UseSearchURLStateOptions) {
	const { state, sortOptions, filterAttributes, onStateChange } = options;
	const route = useRoute();
	const router = useRouter();

	const isUpdatingURL = ref(false);
	let timeoutId: NodeJS.Timeout | null = null;

	function createStateFromURL(): Partial<SearchState> {
		return parseSearchURLState({
			query: route.query,
			filterAttributes,
			includeEmptyDefaults: true, // Always include defaults for URL state management
		});
	}

	function updateURLFromState(newState: SearchState) {
		const query: Record<string, string | string[]> = {};

		// Add search query
		if (newState.query) {
			query.q = newState.query;
		}

		// Add filters
		Object.entries(newState.filters).forEach(([attribute, values]) => {
			if (values.length > 0) {
				query[attribute] = values.join(',');
			}
		});

		// Add sort (only if not default)
		const defaultSort = extractSortParameter(sortOptions[0]?.value || '');

		if (newState.sort && newState.sort !== defaultSort) {
			query.sort = newState.sort;
		}

		// Add page (only if not 1)
		if (newState.page > 1) {
			query.page = String(newState.page);
		}

		// Update route without triggering navigation
		isUpdatingURL.value = true;

		router
			.replace({
				path: route.path,
				query,
			})
			.finally(() => {
				// Reset flag after a short delay to ensure the watcher has run
				if (timeoutId) clearTimeout(timeoutId);

				timeoutId = setTimeout(() => {
					isUpdatingURL.value = false;
					timeoutId = null;
				}, 50);
			});
	}

	// Initialize state from URL on mount
	const initializeFromURL = () => {
		const urlState = createStateFromURL();

		if (Object.keys(urlState).length > 0) {
			onStateChange(urlState);
		}
	};

	// Watch for state changes and update URL
	watch(
		state,
		(newState) => {
			updateURLFromState(newState);
		},
		{ deep: true },
	);

	// Watch for URL changes (browser back/forward)
	watch(
		() => route.query,
		() => {
			// Skip if we're the ones updating the URL
			if (isUpdatingURL.value) {
				return;
			}

			const urlState = createStateFromURL();
			// Only update if URL state differs from current state
			const currentState = state.value;

			const hasChanges =
				urlState.query !== currentState.query ||
				JSON.stringify(urlState.filters) !== JSON.stringify(currentState.filters) ||
				urlState.sort !== currentState.sort ||
				urlState.page !== currentState.page;

			if (hasChanges) {
				onStateChange(urlState);
			}
		},
		{ deep: true },
	);

	// Auto-initialize if URL state differs from current state
	const urlState = createStateFromURL();
	const currentState = state.value;

	const needsInit =
		!import.meta.server &&
		((urlState.query && urlState.query !== currentState.query) ||
			(urlState.filters && JSON.stringify(urlState.filters) !== JSON.stringify(currentState.filters)) ||
			(urlState.sort && urlState.sort !== currentState.sort) ||
			(urlState.page && urlState.page !== currentState.page));

	if (needsInit) {
		onStateChange(urlState);
	}

	// Cleanup on unmount
	onUnmounted(() => {
		if (timeoutId) {
			clearTimeout(timeoutId);
			timeoutId = null;
		}
	});

	return {
		initializeFromURL,
		createStateFromURL,
		updateURLFromState,
	};
}

function extractSortParameter(fullSortValue: string): string {
	const parts = fullSortValue.split('/');
	return parts[parts.length - 1] || fullSortValue;
}
