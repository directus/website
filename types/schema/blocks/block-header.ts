import type { BlockButtonGroup } from './block-button-group';

export interface BlockHeader {
	id: string;
	heading: string | null;
	preheading: string | null;
	alignment: 'left' | 'center' | null;
	subheading: string | null;
	button_group: string | BlockButtonGroup | null;
	block_content: string;
	block_styling: string;
}
