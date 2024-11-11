import type { Resource } from '../content';
import type { Page } from '../routes';
import type { File } from '../system';

export interface BlockCarouselCards {
	id: string;
	title: string;
	image?: string | File | null;
	type?: 'pages' | 'resources' | 'external' | null;
	external_url?: string | null;
	page?: string | Page | null;
	resource?: string | Resource | null;
	button_text?: string;
}
