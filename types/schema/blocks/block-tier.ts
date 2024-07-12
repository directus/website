import type { BlockButton } from './block-button';

export interface BlockTier {
	id: string;
	name: string;
	badge: string | null;
	subtext: string | null;
	price: string;
	term: string | null;
	term_tooltip: string | null;
	description: string | null;
	cta: string | BlockButton | null;
	points: null | { content: string }[];
	highlight: boolean;
	tier_type: 'standard' | 'full_width';
	cards: {
		badge: string | null | undefined;
		title: string | null | undefined;
		icon: string | null | undefined;
		description: string | null | undefined;
		button_url: string | null | undefined;
		button_label: string | null | undefined;
	}[];
}
