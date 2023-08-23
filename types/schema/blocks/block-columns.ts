import type { Block, BlockType } from './block.js';

export interface BlockColumns {
	id: string;
	layout: '1/1' | '1/2' | '2/1' | null;
	col_a: string | BlockColumnsColumn[];
	col_b: string | BlockColumnsColumn[];
}

export interface BlockColumnsColumn {
	id: string;
	block_columns_id: string | BlockColumns | null;
	item: string | Block;
	sort: number | null;
	collection: BlockType;
}
