import type { File } from '../system';

export interface BlockPageNav {
	id: string;
	logo: string | File | null;
	title: string | null;
	navigation:
		| null
		| {
				link: string;
				label: string;
		  }[];
}
