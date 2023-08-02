import type { BlockCard } from './block-card';

export interface BlockCardGroup {
	id: string;
	direction: 'horizontal' | 'vertical' | null;
	aspect_ratio: '1-1' | '16-9' | null;
	cards: string[] | BlockCardGroupBlockCard[] | null;
}

export interface BlockCardGroupBlockCard {
	id: number;
	block_card_group_id: BlockCardGroup | string;
	block_card_id: BlockCard | string;
}
