import type { BlockButton } from './block-button';

export interface BlockButtonGroup {
	id: string;
	size: 'small' | 'medium' | 'large';
	buttons: number[] | BlockButtonGroupBlockButton | null;
}

export interface BlockButtonGroupBlockButton {
	id: string;
	block_button_group_id: BlockButtonGroup | string;
	block_button_id: BlockButton | string;
	sort: number | null;
}
