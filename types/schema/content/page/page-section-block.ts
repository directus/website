import type { Block, BlockType } from '../../blocks/index.js';
import type { PageSection } from './page-section.js';

export interface PageSectionBlock {
	id: string;
	sort: number | null;
	page_sections_id: string | PageSection | null;
	item: string | Block;
	collection: BlockType;
	/** Title is only for internal use. */
	title: string | null;
}
