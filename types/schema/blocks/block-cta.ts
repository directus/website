import type { File } from '../system/index.js';
import type { BlockButton } from './block-button.js';

export interface BlockCta {
	id: string;
	icon: string | File | null;
	heading: string | null;
	subheading: string | null;
	button: string | BlockButton | null;
}
