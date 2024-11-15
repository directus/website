export interface BlockCarousel {
	id: string;
	cards: BlockCarouselBlockCarouselCards[];
}

export interface BlockCarouselBlockCarouselCards {
	id: string;
	block_carousel_id: string;
	block_carousel_cards_id: string;
}
