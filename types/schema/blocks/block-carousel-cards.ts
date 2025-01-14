import type { Resource } from '../content';
import type { Page } from '../routes';
import type { File } from '../system';
import type { BlockButtonGroup } from './block-button-group';

export interface BlockCarouselCards {
	id: string;
	title: string;
	description: string;
	image?: string | File | null;
	type?: 'pages' | 'resources' | 'external' | null;
	external_url?: string | null;
	page?: string | Page | null;
	resource?: string | Resource | null;
	button_text?: string;
	block_button_group?: string | BlockButtonGroup | null;
}
