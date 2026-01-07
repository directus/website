import type { File } from '../system';

export interface IntegrationExternalResource {
	/** @required */
	id: string;
	sort?: number | null;
	/** @required */
	title: string;
	/** @required */
	url: string;
	description?: string | null;
	image?: File | string | null;
	integration?: string | null;
	status?: string | null;
}
