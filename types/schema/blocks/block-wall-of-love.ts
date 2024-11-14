export interface BlockWallOfLove {
	id: string;
	heading: string | null;
	testimonials: BlockWallOfLoveTestimonials[];
}

export interface BlockWallOfLoveTestimonials {
	id: string;
	block_wall_of_love_id: string;
	testimonials_id: string;
}
