import type { ComponentQuote } from '../components';

export interface BlockTestimonialSlider {
	id: string;
	items: BlockTestimonialSliderItem[];
}

export interface BlockTestimonialSliderItem {
	id: string;
	sort: number;
	block_testimonial_slider_id: BlockTestimonialSlider;
	comp_quote_id: ComponentQuote;
}
