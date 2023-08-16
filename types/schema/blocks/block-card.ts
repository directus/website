import type { Page, Resource } from '../content';
import type { File } from '../system';

export interface BlockCard {
	id: string;
	sort: number;
	title: string;
	description: string | null;
	image: string | File | null;
	type: 'pages' | 'resources' | 'external' | null;
	external_url: string | null;
	page: string | Page | null;
	resource: string | Resource | null;
	icon: string | null;
}
