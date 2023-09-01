import type { File } from '../system';

export interface Event {
	id: string;
	status: 'published' | 'draft' | 'archived';
	name: string;
	start_time: string | null;
	location: string | null;
	link_text: string | null;
	link_url: string | null;
	description: string | null;
	cover: string | File | null;
}
