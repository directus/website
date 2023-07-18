export interface BlockLogocloud {
	id: string;
	type: string | null;
	logos: (number | BlockLogocloudLogo)[];
}

export interface BlockLogocloudLogo {
	id: number;
	block_logocloud_id: string | BlockLogocloud | null;
	directus_files_id: string | File | null;
	sort: number | null;
}
