import type { Block } from '../../blocks/index.js';
import type { PageSection } from './page-section.js';

export type BlockType =
	| 'block_hero_form'
	| 'block_hero_headline'
	| 'block_hero_rotator'
	| 'block_media_fullwidth'
	| 'block_separator'
	| 'block_logocloud'
	| 'block_pageheader'
	| 'block_featuregrid'
	| 'block_columns'
	| 'block_showcase'
	| 'block_cardgroup';

export interface PageSectionBlock {
	id: string;
	sort: number | null;
	page_sections_id: string | PageSection | null;
	item: string | Block;
	collection: BlockType;
	/** Title is only for internal use. */
	title: string | null;
}
