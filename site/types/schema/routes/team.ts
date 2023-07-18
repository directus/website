import type { User } from '../system/index.js';

export interface Team {
	id: string;
	status: string;
	sort: number | null;
	user_created: string | User | null;
	date_created: string | null;
	user_updated: string | User | null;
	date_updated: string | null;
	name: string | null;
	job_title: string | null;
	bio: string | null;
	image: string | File | null;
	links: { [key: string]: any } | null;
	slug: string;
	type: string | null;
}
