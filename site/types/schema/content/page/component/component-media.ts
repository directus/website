import type { Video } from '../../video.js';

export interface CompMedia {
	id: string;
	type: string | null;
	embed: string | null;
	video: string | Video | null;
	image: string | File | null;
}
