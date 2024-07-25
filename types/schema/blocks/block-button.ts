import type { Resource } from '../content/resource.js';
import type { Page } from '../routes/index.js';

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
	size: 'small' | 'medium' | 'large' | 'x-large';
	ph_event: string | null;
}
