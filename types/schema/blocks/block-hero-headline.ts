import type { ComponentButtonGroup } from '../components/index.js';

export interface BlockHeroHeadline {
	id: string;
	/** Use italics to make text gradient. */
	heading: string | null;
	subheading: string | null;
	button_group: string | ComponentButtonGroup | null;
}
