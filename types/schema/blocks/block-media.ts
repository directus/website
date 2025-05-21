import type { File } from '../system/file.js';
import type { Video } from '../content/video.js';

export interface BlockMedia {
	id: string;
	type: 'video' | 'image' | 'arcade' | 'external-image' | 'iframe' | null;
	image: string | File | null;
	video: string | Video | null;
	embed: string | null;
	aspect_ratio: 'auto' | '1-1' | '16-9' | '4-3' | null;
	border: boolean;
	arcade_url: string | null;
	arcade_fallback_video: string | File | null;
	external_image_url: string | null;
	border_radius: 'normal' | 'large';
	caption: string | null;
}
