import type { Block, BlockType } from './block';

export interface BlockPaper {
	id: string;
	blocks: number[] | BlockPaperBlocks[];
	padding: 'small' | 'normal' | 'large';
	background: 'pristine-white' | 'simple-gray' | 'colorful' | 'primary' | 'primary-light' | 'dark-night' | 'image';
	background_image: string | File | null;
}

export interface BlockPaperBlocks {
	id: string;
	block_columns_id: string | BlockPaper | null;
	item: string | Block;
	sort: number | null;
	collection: BlockType;
}
