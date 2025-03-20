import type { BlockMedia } from '../blocks/block-media.js';
import type { Seo } from '../meta/index.js';
import type { User } from '../system/index.js';

export interface Feature {
	id: string;
	sort: number | null;
	user_created: string | User | null;
	date_created: string | null;
	user_updated: string | User | null;
	date_updated: string | null;
	title: string | null;
	slug: string | null;
	description: string | null;
	status: string | null;
	content: string | null;
	module?: string | null;
	seo: Seo | null;
	media: BlockMedia | string | null;
	thumbnail: string | File | null;
}
