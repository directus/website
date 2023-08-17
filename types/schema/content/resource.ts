import type { Seo } from '../meta';
import type { Team } from '../routes';
import type { User } from '../system';

export interface Resource {
	id: string;
	sort: number;
	user_created: string | User;
	date_created: string;
	user_updated: string | User | null;
	date_updated: string | null;
	type: 'article' | 'video' | 'case_study';
	status: 'published' | 'draft' | 'archived';
	title: string | null;
	slug: string | null;
	author: string | Team | null;
	date_published: string | null;
	seo: string | Seo | null;
}
