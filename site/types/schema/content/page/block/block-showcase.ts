import type { Video } from '../../video.js';

export interface BlockShowcase {
	id?: string;
	items?: (string | BlockShowcaseItem)[] | null;
}

export interface BlockShowcaseItem {
	id?: string;
	icon?: string | null;
	heading?: string | null;
	subheading?: string | null;
	type?: string | null;
	image?: string | File | null;
	embed?: string | null;
	video?: string | Video | null;
	block_showcase?: string | BlockShowcase | null;
	sort?: number | null;
}
