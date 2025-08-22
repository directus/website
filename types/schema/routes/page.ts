import type { Block, BlockType } from '../blocks/block.js';
import type { Seo } from '../meta/index.js';
import type { User } from '../system/index.js';
import type { Experiment, ExperimentVariant } from '../meta/index.js';

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
	layout: 'default' | 'marketplace';
}

export interface PageBlock {
	id: number;
	pages_id: string | Page;
	item: Block;
	collection: BlockType;
	sort: number | null;
	background: 'pristine-white' | 'pristine-white-lines' | 'simple-gray' | 'dark-night' | 'colorful' | 'colorful-muted';
	spacing: 'none' | 'x-small' | 'small' | 'medium' | 'large' | 'x-large';
	negative_offset: boolean;
	width: 'full' | 'standard' | 'narrow';
	key: string | null;
	experiment: string | Experiment | null;
	experiment_variant: string | ExperimentVariant | null;
}
