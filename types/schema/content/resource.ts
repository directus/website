import type { Seo } from '../meta';
import type { Team } from '../routes';
import type { User } from '../system';
import type { Article } from './article';
import type { CaseStudy } from './case-study';
import type { Video } from './video';

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
	video: string | Video | null;
	article: string | Article | null;
	case_study: string | CaseStudy | null;
	seo: string | Seo | null;
}
