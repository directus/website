import type { File } from '../system/index.js';

export interface HomeReleaseTile {
	id?: number;
	title?: string | null;
	badge?: string | null;
	description?: string | null;
	button_text?: string | null;
	button_url?: string | null;
	show_tile?: boolean | null;
	background?: string | File | null;
	only_image?: string | File | null;
	only_image_alt?: string | null;
	only_image_url?: string | null;
}
