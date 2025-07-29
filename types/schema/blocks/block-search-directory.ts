export interface BlockSearchDirectory {
	id: string;
	collection: 'extensions' | 'integrations' | 'templates';
	hits_per_page?: number;
}
