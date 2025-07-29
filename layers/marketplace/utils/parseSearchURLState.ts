import type { FilterAttribute } from '../composables/useTypesenseSearch';

export interface ParsedSearchState {
	query?: string;
	filters?: Record<string, string[]>;
	sort?: string;
	page?: number;
	hitsPerPage?: number;
}

export interface ParseSearchURLStateOptions {
	query: Record<string, string | string[] | null> | Record<string, any>;
	filterAttributes: FilterAttribute[];
	hitsPerPage?: number;
	includeEmptyDefaults?: boolean;
}

/**
 * Parse URL query parameters into search state
 * Centralized function to avoid duplication between components
 */
export function parseSearchURLState(options: ParseSearchURLStateOptions): ParsedSearchState {
	const { query, filterAttributes, hitsPerPage, includeEmptyDefaults = false } = options;

	const state: ParsedSearchState = {};

	// Add hitsPerPage if provided
	if (hitsPerPage) {
		state.hitsPerPage = hitsPerPage;
	}

	// Parse query parameter
	if (query.q) {
		state.query = String(query.q);
	} else if (includeEmptyDefaults) {
		state.query = '';
	}

	// Parse filter parameters
	const filters: Record<string, string[]> = {};

	filterAttributes.forEach((attr) => {
		const value = query[attr.attribute];

		if (value) {
			if (typeof value === 'string') {
				filters[attr.attribute] = value.split(',');
			} else if (Array.isArray(value)) {
				filters[attr.attribute] = value.filter((v): v is string => typeof v === 'string');
			}
		}
	});

	if (Object.keys(filters).length > 0 || includeEmptyDefaults) {
		state.filters = filters;
	}

	// Parse sort parameter
	if (query.sort) {
		state.sort = String(query.sort);
	}

	// Parse page parameter
	if (query.page) {
		const page = parseInt(String(query.page), 10);

		if (!isNaN(page) && page >= 1) {
			state.page = page;
		}
	} else if (includeEmptyDefaults) {
		state.page = 1;
	}

	return state;
}