import type { Block, BlockType } from './block';

export interface BlockPaper {
	id: string;
	blocks: number[] | BlockPaperBlocks[];
	padding: 'small' | 'normal';
}

export interface BlockPaperBlocks {
	id: string;
	block_columns_id: string | BlockPaper | null;
	item: string | Block;
	sort: number | null;
	collection: BlockType;
}
