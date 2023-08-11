import type { Page } from '../content/page.js';
import type { Resource } from '../content/resource.js';

export interface BlockButton {
	id: string;
	sort: number | null;
	label: string | null;
	color: 'primary' | 'secondary';
	outline: boolean;
	page: string | Page | null;
	type: string | null;
	resource: string | Resource | null;
	external_url: string | null;
	icon: string | null;
	size: 'small' | 'medium' | 'large';
}
