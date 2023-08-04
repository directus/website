import type { Page } from '../content/page/page.js';
import type { Resource } from '../content/resource.js';

export interface BlockButton {
	id: string;
	sort: number | null;
	label: string | null;
	color: 'primary' | 'secondary' | 'gray' | 'white' | 'danger';
	pulse: boolean;
	variant: 'solid' | 'frosted' | 'gradient';
	page: string | Page | null;
	type: string | null;
	resource: string | Resource | null;
	external_url: string | null;
	icon: string | null;
	size: 'small' | 'medium' | 'large' | null;
}
