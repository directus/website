import type { Seo } from '../meta/index.js';
import type { User } from '../system/index.js';
import type { Block, BlockType } from '../blocks/block.js';

export interface Page {
	id: string;
	status: string;
	sort: number | null;
	user_created: string | User | null;
	date_created: string | null;
	user_updated: string | User | null;
	date_updated: string | null;
	title: string | null;
	seo: string | Seo | null;
	permalink: string;
	blocks: number[] | PageBlock[];
	spacing_top: 'small' | 'normal';
}

export interface PageBlock {
	id: number;
	pages_id: string | Page;
	item: Block;
	collection: BlockType;
	sort: number | null;
	background: 'pristine-white' | 'pristine-white-lines' | 'simple-gray' | 'easy-gray' | 'dark-night' | 'colorful';
	spacing: 'none' | 'small' | 'medium' | 'large';
	negative_offset: boolean;
	width: 'standard' | 'narrow';
	key: string | null;
}
