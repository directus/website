import type { User } from '../system/index.js';

export interface SiteBanner {
	id: string;
	status: string;
	sort: number | null;
	user_created: string | User | null;
	date_created: string | null;
	user_updated: string | User | null;
	date_updated: string | null;
	link: string | null;
	content: string | null;
	icon: string;
}
