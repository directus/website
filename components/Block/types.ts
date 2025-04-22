export interface BlockProps {
	uuid: string;
}

export interface BlockHeader {
	id: string;
	preheading: string | null;
	heading: string | null;
	subheading: string | null;
	alignment: 'left' | 'center' | null;
	heading_size: 'title' | 'x-large' | 'large' | 'medium' | 'small';
	heading_tag: 'h1' | 'h2' | 'h3' | 'h4' | null;
	button_group: string | null;
	subheading_color: string | null;
	subheading_type: string | null;
	command: string | null;
}
