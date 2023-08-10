import type { BlockAccordion } from './block-accordion';

export interface BlockAccordionGroup {
	id: string;
	items: number[] | BlockAccordionGroupItems[];
}

export interface BlockAccordionGroupItems {
	id: string;
	block_accordion_group_id: string | BlockAccordionGroup;
	block_accordion_id: string | BlockAccordion;
	sort: number;
}
