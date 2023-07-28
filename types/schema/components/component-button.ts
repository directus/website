import type { Page } from '../content/page/page.js';
import type { Resource } from '../content/resource.js';
import type { ComponentButtonGroup } from './component-button-group.js';

export interface ComponentButton {
	id: string;
	sort: number | null;
	label: string | null;
	color: 'primary' | 'secondary' | 'gray' | 'white' | 'danger';
	pulse: boolean;
	variant: 'solid' | 'frosted' | 'gradient';
	button_group: string | ComponentButtonGroup | null;
	page: string | Page | null;
	type: string | null;
	resource: string | Resource | null;
	external_url: string | null;
	icon: string | null;
}
