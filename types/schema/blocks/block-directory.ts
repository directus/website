export interface BlockDirectory {
	id: string;
	collection: 'agency_partners';
	filter: Record<string, unknown> | null;
	style:
		| 'none'
		| 'image-fill-16-9'
		| 'image-fill-1-1'
		| 'image-centered-16-9'
		| 'image-centered-1-1'
		| 'icon-centered-16-9'
		| 'icon-centered-1-1'
		| 'image-title'
		| 'icon-title'
		| 'icon-above-title';
	grid: '3' | '4' | '6';
	title_size: 'small' | 'medium' | 'large';
}
