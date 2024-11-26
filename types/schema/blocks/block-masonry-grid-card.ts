import type { Resource } from '../content';
import type { Page } from '../routes';
import type { File } from '../system';

export interface BlockMasonryGridCard {
	id: string;
	sort: number;
	title: string;
	description: string | null;
	image: string | File | null;
	type: 'pages' | 'resources' | 'external' | null;
	size: 'single' | 'double' | null;
	external_url: string | null;
	page: string | Page | null;
	resource: string | Resource | null;
}
