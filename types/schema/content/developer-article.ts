import type { File, User } from '../system';

export interface DeveloperArticle {
	id: string;
	status: 'published' | 'draft' | 'hidden' | 'archived';
	user_created: string | User;
	date_created: string;
	user_updated: string | User | null;
	date_updated: string | null;
	date_published: string | null;
	slug: string;
	author: string | User | null;
	title: string;
	summary: string | null;
	content: string;
	tags: (string | DeveloperArticleDocTag)[] | null;
	image: string | File;
	contributors: {
		name: string | null;
		url: string | null;
	}[];
}

export interface DeveloperArticleDocTag {
	id: string;
	developer_articles_id: string | DeveloperArticle;
	docs_tags_id: string | DocTag;
}

export interface DocTag {
	id: string;
	tile: string;
	slug: string;
	type: string | null;
	developer_articles: (string | DeveloperArticleDocTag)[] | null;
}
