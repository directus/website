import type { Seo } from '../meta/index.js';

export interface ContentType {
	id: string;
	sort: number | null;
	title: string | null;
	color: string | null;
	slug: string | null;
	seo: string | Seo | null;
}
