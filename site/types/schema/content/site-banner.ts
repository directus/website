import type { User } from '../system/index.js';

export interface SiteBanner {
	id: string;
	status: string;
	sort: number | null;
	user_created: string | User | null;
	date_created: string | null;
	user_updated: string | User | null;
	date_updated: string | null;
	/** Keep the content as short as possible. */
	content: string | null;
	show_button: boolean | null;
	button_text: string | null;
	button_url: string | null;
	button: string;
}
