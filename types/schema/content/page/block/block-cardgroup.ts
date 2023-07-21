import type { File } from '../../../system';
import type { ComponentButton } from '../component';

export interface BlockCardGroup {
	id: string;
	variant: 'gray' | 'white' | 'resource';
	cards: string[] | BlockCardGroupCards[] | null;
}

export interface BlockCardGroupCards {
	id: string;
	block_cardgroup: BlockCardGroup;
	sort: number;
	title: string | null;
	description: string | null;
	image_size: 'icon' | 'cover' | null;
	image: File | null;
	button: ComponentButton | null;
	href: string | null;
}
