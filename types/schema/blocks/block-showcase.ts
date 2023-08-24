import type { Block, BlockType } from './block.js';

export interface BlockShowcase {
	id: string;
	items: string[] | BlockShowcaseItem[] | null;
}

export interface BlockShowcaseItem {
	id: string;
	block_showcase: string | BlockShowcase | null;
	icon: string | null;
	heading: string | null;
	subheading: string | null;
	sort: number | null;
	blocks: number[] | BlockShowcaseItemBlock[];
}

export interface BlockShowcaseItemBlock {
	id: number;
	block_showcase_item: string | BlockShowcaseItem;
	item: string | Block;
	sort: number | null;
	collection: BlockType;
}
