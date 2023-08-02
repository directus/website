import type { Page, Resource } from '../content';
import type { File } from '../system';

export interface BlockCardGroup {
	id: string;
	direction: 'horizontal' | 'vertical' | null;
	aspect_ratio: '1-1' | '16-9' | null;
	cards: string[] | BlockCardGroupCards[] | null;
}

export interface BlockCardGroupCards {
	id: string;
	block_cardgroup: BlockCardGroup;
	sort: number;
	title: string;
	description: string | null;
	image_size: 'icon' | 'cover' | null;
	image: string | File | null;
	type: 'pages' | 'resources' | 'external' | null;
	external_url: string | null;
	page: string | Page | null;
	resource: string | Resource | null;
}
