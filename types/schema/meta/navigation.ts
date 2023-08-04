import { BlockCard } from '../blocks/block-card.js';
import type { Page } from '../content/index.js';
import type { File, User } from '../system/index.js';

export interface Navigation {
	id: string;
	user_created: string | User | null;
	date_created: string | null;
	user_updated: string | User | null;
	date_updated: string | null;
	title: string | null;
	items: NavigationItem[];
}

export interface NavigationItem {
	id: string;
	sort: number | null;
	title: string | null;
	navigation: string | Navigation | null;
	has_children: boolean | null;
	type: string | null;
	open_in_new_tab: boolean | null;
	page: string | Page | null;
	url: string | null;
	description: string | null;
	image: string | File | null;
	icon: string | null;
	children: NavigationItem[];
	children_title: string | null;
	parent: string | Navigation | null;
	callout: string | BlockCard | null;
	callout_title: string | null;
}
