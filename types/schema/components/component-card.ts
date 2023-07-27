import type { File } from '../system/file.js';
import type { Page } from '../content/page/page.js';
import type { Resource } from '../content/resource.js';

export interface ComponentCard {
	id: string;
	sort: number | null;
	title: string | null;
	description: string | null;
	image: File | null;
	type: string | null;
	page: string | Page | null;
	resource: string | Resource | null;
	external_url: string | null;
}
