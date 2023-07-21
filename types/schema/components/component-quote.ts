import type { File } from '../system/index.js';

export interface CompQuote {
	id: string;
	quote: string | null;
	person_name: string | null;
	person_title: string | null;
	person_image: string | File | null;
	company_logo: string | File | null;
}
