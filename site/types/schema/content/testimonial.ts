export interface Testimonial {
	id?: string;
	status?: string;
	title?: string | null;
	subtitle?: string | null;
	image?: string | File | null;
	text?: string | null;
	sort?: number | null;
	large_image?: boolean | null;
}
