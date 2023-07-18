import type { Block } from './block/index.js';
import type { PageSection } from './page-section.js';

export interface PageSectionBlock {
	id: string;
	sort: number | null;
	page_sections_id: string | PageSection | null;
	item: string | Block | null;
	collection: string | null;
	/** Title is only for internal use. */
	title: string | null;
}
