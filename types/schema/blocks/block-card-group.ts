import type { BlockCard } from './block-card';

export interface BlockCardGroup {
	id: string;
	stacked: boolean;
	style:
		| 'none'
		| 'image-fill-16-9'
		| 'image-fill-1-1'
		| 'image-centered-16-9'
		| 'image-centered-1-1'
		| 'icon-centered-16-9'
		| 'icon-centered-1-1'
		| 'image-title'
		| 'icon-title'
		| 'icon-above-title';
	grid: '3' | '4' | '6';
	cards: string[] | BlockCardGroupBlockCard[] | null;
}

export interface BlockCardGroupBlockCard {
	id: number;
	block_card_group_id: BlockCardGroup | string;
	block_card_id: BlockCard | string;
}
