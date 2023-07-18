import { ComponentButtonGroup } from '../component/index.js';

export interface BlockPageheader {
	id: string;
	heading: string | null;
	preheading: string | null;
	alignment: string | null;
	subheading: string | null;
	buttons: (string | ComponentButtonGroup) | null;
	block_content: string;
	block_styling: string;
}
