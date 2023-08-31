import type { File } from '../system';

export interface BlockPageNav {
	id: string;
	logo: string | File | null;
	title: string | null;
	tag: 'h1' | 'h2' | 'h3' | 'p';
	navigation:
		| null
		| {
				link: string;
				label: string;
		  }[];
}
