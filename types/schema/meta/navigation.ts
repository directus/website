import type { Page } from '../content/index.js';
import type { File, User } from '../system/index.js';

export interface Navigation {
	id: string;
	status: string;
	user_created: string | User | null;
	date_created: string | null;
	user_updated: string | User | null;
	date_updated: string | null;
	title: string | null;
	navigationItems: NavigationItem[];
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
	parent: string | Navigation | null;
	description: string | null;
	image: string | File | null;
	/** Add this item to far right and make it huge. **Use only 1 per submenu** */
	callout: boolean | null;
	children: NavigationItem[];
}
