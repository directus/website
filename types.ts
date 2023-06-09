// Page Builder
export interface Block {
	id: string;
	collection: string;
	item: object;
}

export interface Seo {
	id?: string;
	title?: string;
	meta_description?: string;
	no_index?: boolean;
	no_follow?: boolean;
	canonical_url?: string;
	site_map_priority?: number;
	site_map_change_frequency?: string;
	og_image?: string;
	twitter_image?: string;
}

export interface Page {
	id: string;
	title: string;
	permalink: string;
	image?: string;
	blocks?: Block[];
	seo?: Seo;
}
