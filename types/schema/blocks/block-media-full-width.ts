import type { File } from '../system/file.js';
import type { Video } from '../content/video.js';

export interface BlockMediaFullWidth {
	id: string;
	type: string | null;
	image: string | File | null;
	video: string | Video | null;
	embed: string | null;
}
