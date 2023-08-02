import type { File } from '../system/index.js';
import type { BlockButton } from './block-button.js';

export interface BlockQuote {
	id: string;
	quote: string | null;
	person_name: string | null;
	person_title: string | null;
	person_image: string | File | null;
	company_name: string | null;
	company_logo: string | File | null;
	button: BlockButton | null;
}
