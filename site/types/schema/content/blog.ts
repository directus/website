import type { Article } from './article.js';

export interface Blog {
	id: number;
	main: string | Article | null;
	featured: (number | BlogFeatured)[];
	popular: (number | BlogPopular)[];
}

export interface BlogFeatured {
	id: number;
	blog_id: number | Blog | null;
	articles_id: string | Article | null;
	sort: number | null;
}

export interface BlogPopular {
	id: number;
	blog_id: number | Blog | null;
	articles_id: string | Article | null;
	sort: number | null;
}
