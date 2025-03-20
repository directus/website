import type { ContentType, Page } from '../routes/index.js';

export interface Seo {
	id: string;
	/** This entries title, defaults to title. Max 70 characters including the site name. */
	title: string | null;
	/** This entries meta description. Max 160 characters. */
	meta_description: string | null;
	/** Instruct crawlers not to index this entry. */
	no_index: boolean | null;
	/** Instruct crawlers not to follow links on this page. */
	no_follow: boolean | null;
	/** Where should the canonical URL for this entry point to. */
	canonical_url: string | null;
	/** Valid values range from 0.0 to 1.0. This value does not affect how your pages are compared to pages on other sites, it only lets the search engines know which pages you deem most important for the crawlers. */
	sitemap_priority: number | null;
	/** How often to instruct search engines to crawl. */
	sitemap_change_frequency: string | null;
	/** This item's OG image. Defaults to global site OG image. The recommended size is 1200px x 630px. The image will be focal cropped to this dimension. */
	og_image: string | File | null;
	json_ld: string | null;
	pages: string[] | Page[];
	content_types: string[] | ContentType[];
}
