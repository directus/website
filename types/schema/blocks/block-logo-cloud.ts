import type { File } from '../system/index.js';

export interface BlockLogoCloud {
	id: string;
	type: 'ticker' | 'grid' | null;
	logos: number[] | BlockLogoCloudLogo[];
}

export interface BlockLogoCloudLogo {
	id: number;
	block_logocloud_id: string | BlockLogoCloud | null;
	directus_files_id: string | File;
	sort: number | null;
}
