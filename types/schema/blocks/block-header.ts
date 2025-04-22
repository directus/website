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
	preheading_tag: 'h1' | 'h2' | 'h3' | 'p' | null;
	heading_tag: 'h1' | 'h2' | 'h3' | 'p' | null;
	heading_size: 'title' | 'x-large' | 'large' | 'medium' | 'small';
	subheading_color: 'foreground' | 'subdued';
	subheading_type: 'default' | 'subtext';
	command: string | null;
}
