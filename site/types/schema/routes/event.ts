import type { File } from '../system/file.js';

export interface Event {
	id: number;
	status: string;
	name: string | null;
	start_time: string | null;
	cover: string | File | null;
	link_text: string | null;
	link_url: string | null;
	description: string | null;
	location: string | null;
}
