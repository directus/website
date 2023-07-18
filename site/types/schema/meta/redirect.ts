import type { User } from '../system/index.js';

export interface Redirect {
	id?: string;
	user_created?: string | User | null;
	date_created?: string | null;
	user_updated?: string | User | null;
	date_updated?: string | null;
	url_old?: string;
	url_new?: string;
	response_code?: string | null;
}
