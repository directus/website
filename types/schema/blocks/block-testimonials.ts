export interface BlockTestimonials {
	id: string;
	sort: number;
	name: string;
	company: string | null;
	role: string | null;
	quote: string;
	logo: string | File | null;
	avatar: string | File | null;
	avatar_url: string | null;
}
