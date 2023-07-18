import type { Video } from '../../video.js';

export interface BlockMediaFullWidth {
	id: string;
	type: string | null;
	image: string | File | null;
	video: string | Video | null;
	embed: string | null;
}
