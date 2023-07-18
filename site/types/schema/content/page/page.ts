import type { Seo } from '../../meta/index.js';
import type { User } from '../../system/index.js';
import type { PageSection } from './page-section.js';

export interface Page {
	id: string;
	status: string;
	sort: number | null;
	user_created: string | User | null;
	date_created: string | null;
	user_updated: string | User | null;
	date_updated: string | null;
	title: string | null;
	seo: string | Seo | null;
	/** Start with a slash (/page) and do NOT add a trailing slash (/page/) */
	permalink: string;
	sections: string[] | PageSection[];
}
