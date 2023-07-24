import type { File } from '../system/index.js';
import type { Video } from '../content/video.js';

export interface ComponentMedia {
	id: string;
	type: string | null;
	embed: string | null;
	video: string | Video | null;
	image: string | File | null;
}
