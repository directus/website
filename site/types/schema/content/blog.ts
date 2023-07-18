import type { Article } from './article.js';

export interface Blog {
	id: number;
	main: string | Article | null;
	featured: number[] | BlogJunction[] | null;
	popular: number[] | BlogJunction[] | null;
}

export interface BlogJunction {
	id: number;
	blog_id: number | Blog | null;
	articles_id: string | Article | null;
	sort: number | null;
}
