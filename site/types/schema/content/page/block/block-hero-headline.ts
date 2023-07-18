import type { ComponentButtonGroup } from '../component/index.js';

export interface BlockHeroHeadline {
	id?: string;
	/** Use italics to make text gradient. */
	heading?: string | null;
	subheading?: string | null;
	button_group?: (string | ComponentButtonGroup) | null;
}
