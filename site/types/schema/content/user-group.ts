import type { File } from '../system/index.js';

export interface UserGroup {
	id?: number;
	name?: string | null;
	cover?: string | File | null;
	link_url?: string | null;
}
