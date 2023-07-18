import type { SEO } from '../meta/index.js';

export interface ContentType {
	id?: string;
	sort?: number | null;
	title?: string | null;
	color?: string | null;
	slug?: string | null;
	seo?: string | SEO | null;
}
