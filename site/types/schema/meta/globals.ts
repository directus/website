import type { User } from '../system/index.js';

export interface Globals {
	id?: string;
	user_updated?: string | User | null;
	date_updated?: string | null;
	/** This data is used for the contact forms to properly route leads to the right sales reps. */
	reps?: { [key: string]: any } | null;
	title?: string | null;
	description?: string | null;
	url?: string | null;
	social_links?: { service: string; url: string } | null;
	og_image?: string | File | null;
	social?: string;
	sales?: string;
	seo?: string;
}
