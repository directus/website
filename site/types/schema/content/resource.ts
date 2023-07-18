import type { Team } from '../routes/index.js';
import type { User } from '../system/index.js';
import type { Video } from './video.js';

export interface Resource {
	id?: string;
	status?: string;
	sort?: number | null;
	user_created?: string | User | null;
	date_created?: string | null;
	user_updated?: string | User | null;
	date_updated?: string | null;
	video?: string | Video | null;
	type?: string | null;
	title?: string | null;
	date_published?: string | null;
	author?: string | Team | null;
	slug?: string | null;
}
