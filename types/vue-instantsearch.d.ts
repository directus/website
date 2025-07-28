declare module 'vue-instantsearch/vue3/es' {
	import Vue from 'vue';
	import { SearchClient } from 'algoliasearch';

	export interface SearchItem {
		value: string;
		count: number;
		label: string;
		isRefined: boolean;
		highlighted: boolean;
	}

	export type ItemsTransformer = <T extends SearchItem>(items: SearchItem[]) => T[];

	export type SortKey = 'count:asc' | 'count:desc' | 'name:asc' | 'name:desc' | 'isRefined';

	export type Sorter = SortKey[] | Function;

	export class AisAutocomplete extends Vue {
		escapeHTML?: boolean;
	}

	export class AisBreadcrumb extends Vue {
		attributes: string[];
		separator?: string;
		rootPath?: string | null;
		transformItems?: ItemsTransformer;
	}

	export class AisClearRefinements extends Vue {
		excludedAttributes?: string[];
		includedAttributes?: string[];
		transformItems?: ItemsTransformer;
	}

	export class AisConfigure extends Vue {
		hitsPerPage?: number;
		attributesToReceive?: string[];
		attributesToHighlight?: string[];
		attributesToSnippet?: string[];
		queryLanguages?: string[];
		restrictSearchableAttributes?: string[];
		snippetEllipsisText?: string;
		analytics?: boolean;
	}

	export class AisExperimentalConfigureRelatedItems extends Vue {
		hit: object;
		matchingPatterns: object;
		transformSearchParameters?: (params: unknown) => unknown;
	}

	export class AisCurrentRefinements extends Vue {
		excludedAttributes?: string[];
		includedAttributes?: string[];
		transformItems?: ItemsTransformer;
	}

	export class AisHierarchicalMenu extends Vue {
		attributes: string[];
		limit?: number;
		showMoreLimit?: number;
		showMore?: boolean;
		sortBy?: Sorter;
		separator?: string;
		rootPath?: string | null;
		showParentLevel?: boolean;
		transformItems?: ItemsTransformer;
	}

	export class AisHighlight extends Vue {
		hit: object;
		attribute: string;
		highlightedTagName?: string;
	}

	export class AisHits extends Vue {
		escapeHTML?: boolean;
		transformItems?: ItemsTransformer;
	}

	export class AisHitsPerPage extends Vue {
		items?: SearchItem[];
		transformItems?: ItemsTransformer;
	}

	export class AisIndex extends Vue {
		indexName: string;
		indexId?: string;
	}

	export class AisInstantSearch extends Vue {
		searchClient: SearchClient;
		insightsClient?: Function;
		indexName: string;
		routing?: {
			router?: unknown;
			stateMapping?: unknown;
		};

		stalledSearchDelay?: number;
		searchFunction?: Function;
		initialUiState?: object;
	}

	export class AisInstantSearchSsr extends Vue {}

	export class AisInfiniteHits extends Vue {
		showPrevious?: boolean;
		escapeHTML?: boolean;
		transformItems?: ItemsTransformer;
		cache?: object;
	}

	export class AisMenu extends Vue {
		attribute: string;
		limit?: number;
		showMoreLimit?: number;
		showMore?: boolean;
		sortBy?: Sorter;
		transformItems?: ItemsTransformer;
	}

	export class AisMenuSelect extends Vue {
		attribute: string;
		limit?: number;
		sortBy?: Sorter;
		transformItems?: ItemsTransformer;
	}

	export class AisNumericMenu extends Vue {
		attribute: string;
		items: SearchItem[];
		transformItems?: ItemsTransformer;
	}

	export class AisPagination extends Vue {
		padding?: number;
		totalPages?: number;
		showFirst?: boolean;
		showLast?: boolean;
		showNext?: boolean;
		showPrevious?: boolean;
	}

	export class AisPanel extends Vue {}

	export class AisPoweredBy extends Vue {
		theme?: 'light' | 'dark';
	}

	export class AisQueryRuleContext extends Vue {
		trackedFilters: object;
		transformRuleContexts?: (contexts: string[]) => string[];
	}

	export class AisQueryRuleCustomData extends Vue {
		transformItems?: ItemsTransformer;
	}

	export class AisRangeInput extends Vue {
		attribute: string;
		min?: number;
		max?: number;
		precision?: number;
	}

	export class AisRatingMenu extends Vue {
		attribute: string;
		max?: number;
	}

	export class AisRefinementList extends Vue {
		attribute: string;
		searchable?: boolean;
		searchablePlaceholder?: string;
		operator?: 'and' | 'or';
		limit?: number;
		showMoreLimit?: number;
		showMore?: boolean;
		sortBy?: Sorter;
		transformItems?: ItemsTransformer;
	}

	export class AisStateResults extends Vue {}

	export class AisSearchBox extends Vue {
		placeholder?: string;
		autofocus?: boolean;
		showLoadingIndicator?: boolean;
		submitTitle?: string;
		resetTitle?: string;
		value?: string;
	}

	export class AisSnippet extends Vue {
		hit: object;
		attribute: string;
		highlightedTagName?: string;
	}

	export class AisSortBy extends Vue {
		items: SearchItem[];
		transformItems?: ItemsTransformer;
	}

	export class AisStats extends Vue {}

	export class AisToggleRefinement extends Vue {
		attribute: string;
		label: string;
		on?: string | number | boolean | (string | number | boolean)[];
		off?: string | number | boolean | (string | number | boolean)[];
	}

	export class AisVoiceSearch extends Vue {
		searchAsYouSpeak?: boolean;
		buttonTitle?: string;
		disabledButtonTitle?: string;
	}

	export function createServerRootMixin(options: {
		searchClient: SearchClient;
		indexName: string;
		routing?: unknown;
		future?: {
			preserveSharedStateOnUnmount?: boolean;
		};
	}): any;
}
