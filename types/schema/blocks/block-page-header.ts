import { ComponentButtonGroup } from '../components/index.js';

export interface BlockPageHeader {
	id: string;
	heading: string | null;
	preheading: string | null;
	alignment: 'left' | 'center' | null;
	subheading: string | null;
	button_group: string | ComponentButtonGroup | null;
	block_content: string;
	block_styling: string;
}
