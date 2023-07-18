import type { Resource } from '../../resource.js';
import type { Page } from '../page.js';
import type { ComponentButtonGroup } from './component-button-group.js';

export interface ComponentButton {
	id: string;
	sort: number | null;
	label: string | null;
	variant: string;
	button_group: string | ComponentButtonGroup | null;
	page: string | Page | null;
	type: string | null;
	resource: string | Resource | null;
	external_url: string | null;
}
