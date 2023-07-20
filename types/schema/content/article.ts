import type { File, User } from '../system/index.js';

export interface Article {
	/** This also doubles as the URL slug */
	id: string;
	status: string;
	user_created: string | User | null;
	date_created: string | null;
	title: string;
	summary: string;
	body: string | null;
	category: string;
	image: string | File;
	/** Overrides the article detail page, taking users directly to this URL. */
	url: string | null;
	publish_date: string | null;
	show_mast_image: boolean | null;
}
