import type { ComponentButton } from '../components/index.js';
import type { File } from '../system/index.js';

export interface ComponentQuote {
	id: string;
	quote: string | null;
	person_name: string | null;
	person_title: string | null;
	person_image: string | File | null;
	company_name: string | null;
	company_logo: string | File | null;
	button: ComponentButton | null;
}
