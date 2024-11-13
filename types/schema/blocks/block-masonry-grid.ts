export interface BlockMasonryGrid {
	id: string;
	grid_layout: 'six_cards' | 'four_cards' | 'two_cards';
	cards: BlockMasonryGridBlockMasonryGridCards[];
}

export interface BlockMasonryGridBlockMasonryGridCards {
	id: string;
	block_masonry_grid_id: string;
	block_masonry_grid_card_id: string;
}
