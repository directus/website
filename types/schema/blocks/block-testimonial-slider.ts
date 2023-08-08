import type { BlockQuote } from './block-quote';

export interface BlockTestimonialSlider {
	id: string;
	items: number[] | BlockTestimonialSliderItems[] | null;
}

export interface BlockTestimonialSliderItems {
	id: number;
	block_testimonial_slider_id: string | BlockTestimonialSlider;
	block_quote_id: string | BlockQuote;
}
