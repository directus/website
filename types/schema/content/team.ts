import type { File, User } from '../system/index.js';
import type { Resource } from './index.js';

export interface Team {
	id: string;
	status: string;
	sort: number | null;
	user_created: string | User | null;
	date_created: string | null;
	user_updated: string | User | null;
	date_updated: string | null;
	name: string;
	job_title: string | null;
	bio: string | null;
	team: string | null;
	image: string | File | null;
	links: { [key: string]: any } | null;
	slug: string;
	type: 'core_team' | 'advisor' | 'investor' | 'key_contributor' | 'key_sponsor' | 'guest_author' | null;
	resources: string[] | Resource[] | null;
}
