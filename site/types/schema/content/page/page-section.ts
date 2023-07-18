import type { User } from '../../system/index.js';
import type { PageSectionBlock } from './page-section-block.js';
import type { Page } from './page.js';

export interface PageSection {
	id: string;
	sort: number | null;
	user_created: string | User | null;
	date_created: string | null;
	user_updated: string | User | null;
	date_updated: string | null;
	background: string | null;
	page: string | Page | null;
	/** Title is only for internal use. */
	title: string | null;
	blocks: string[] | PageSectionBlock[];
}
