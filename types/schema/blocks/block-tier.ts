import type { BlockButton } from './block-button';

export interface BlockTier {
	id: string;
	name: string;
	subtext: string | null;
	price: string;
	term: string | null;
	term_tooltip: string | null;
	description: string | null;
	cta: string | BlockButton | null;
	points: null | { content: string }[];
	highlight: boolean;
}
