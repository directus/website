export interface BlockMasonryGridCard {
	id: string;
	sort: number;
	title: string;
	description: string | null;
	image: string | File | null;
	type: 'single' | 'double' | null;
}
