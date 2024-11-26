import type { Resource } from '../content/index.js';
import type { Page } from '../routes/page.js';
import type { File } from '../system/index.js';

export interface BlockLogoCloud {
	id: string;
	type: 'ticker' | 'grid' | 'title' | 'double' | null;
	logos: number[] | BlockLogoCloudLogo[];
}

export interface BlockLogoCloudLogo {
	id: number;
	block_logocloud_id: string | BlockLogoCloud | null;
	directus_files_id: string | File;
	sort: number | null;
	title: string | null;
	resource: string | Resource | null;
	page: string | Page | null;
	external_url: string | null;
}
