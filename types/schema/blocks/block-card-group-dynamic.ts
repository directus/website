export interface BlockCardGroupDynamic {
	id: string;
	collection: 'resources' | 'team';
	filter: Record<string, unknown> | null;
	sort: string | null;
	stacked: boolean;
	style:
		| 'none'
		| 'image-fill-16-9'
		| 'image-fill-1-1'
		| 'image-centered-16-9'
		| 'image-centered-1-1'
		| 'icon-centered-16-9'
		| 'icon-centered-1-1'
		| 'image-title'
		| 'icon-title';
	grid: '3' | '4' | '6';
}
