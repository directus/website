export interface BlockCardGroupDynamic {
	id: string;
	collection: 'resources' | 'team' | 'events';
	filter: Record<string, unknown> | null;
	sort: string | null;
	sort_direction: 'asc' | 'desc';
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
		| 'icon-title'
		| 'icon-above-title';
	grid: '3' | '4' | '6';
	tabs:
		| null
		| {
				name: string;
				filter: Record<string, unknown>;
		  }[];
	limit: number;
	title_size: 'small' | 'normal';
}
