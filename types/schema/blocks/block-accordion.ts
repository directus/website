import type { Block, BlockType } from './block.js';

export interface BlockAccordion {
	id: string;
	sort: number | null;
	icon: string | null;
	title: string;
	content: string[] | BlockAccordionContent[];
}

export interface BlockAccordionContent {
	id: string;
	sort: number | null;
	block_accordion_id: BlockAccordion | string;
	item: string | Block;
	collection: BlockType;
}
