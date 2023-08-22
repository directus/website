import type { Block, BlockType } from '../blocks';
import type { Seo } from '../meta';
import type { ContentType } from '../routes';
import type { File, User } from '../system';
import type { Team } from './team';
import type { Video } from './video';

export interface Resource {
	id: string;
	sort: number;
	status: 'published' | 'draft' | 'archived';
	user_created: string | User;
	date_created: string;
	user_updated: string | User | null;
	date_updated: string | null;
	date_published: string | null;
	slug: string;
	author: string | Team | null;
	title: string;
	seo: string | Seo | null;
	type: string | ContentType;
	category: string;
	video: string | Video | null;
	summary: string;
	blocks: number[] | ResourceBlock[];
	image: string | File;
}

export interface ResourceBlock {
	id: number;
	resource_id: string | Resource;
	collection: BlockType;
	item: string | Block;
	sort: number;
	spacing: 'none' | 'small' | 'medium' | 'large';
}
