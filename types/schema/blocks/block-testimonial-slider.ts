import type { File } from '../system';

export interface BlockTestimonialSlider {
	id: string;
	items: BlockTestimonialSliderItem[];
}

export interface BlockTestimonialSliderItem {
	id: string;
	company_logo?: File | string | null;
	company_name?: string;
	person_name?: string;
	person_title?: string;
	person_image?: File | string | null;
	quote?: string;
}
