export interface BlockFeatureGrid {
	id: string;
	features:
		| {
				icon: string;
				title: string;
				description: string;
		  }[]
		| null;
}
