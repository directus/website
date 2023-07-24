import type { Block } from './block.js';

export interface BlockColumns {
	id: string;
	col_one: string | BlockColumnsColumn[];
	col_two: string | BlockColumnsColumn[];
}

export interface BlockColumnsColumn {
	id: string;
	block_columns_id: string | BlockColumns | null;
	item: string | Block | null;
	sort: number | null;
	collection: string | null;
}
