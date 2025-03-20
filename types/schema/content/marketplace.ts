import type { File, User } from '../system';
import type { Video } from './video';

export interface Creator {
	/** @required */
	id: string;
	user_created?: User | string | null;
	date_created?: string | null;
	user_updated?: User | string | null;
	date_updated?: string | null;
	first_name?: string | null;
	last_name?: string | null;
	email?: string | null;
	github_username?: string | null;
	avatar?: File | string | null;
	verified?: boolean | null;
	slug?: string | null;
	bio?: string | null;
	links?: Array<{
		services: 'website' | 'x' | 'facebook' | 'linkedin' | 'instagram' | 'youtube' | 'github';
		url: string;
	}> | null;
	npm_username?: string | null;
	directus_registry_id?: string | null;
	date_joined?: string | null;
	core_team?: boolean | null;
	extensions?: Extension[] | string[];
	templates?: Template[] | string[];
}

export interface Extension {
	/** @required */
	id: string;
	status?: 'published' | 'draft' | 'archived';
	sort?: number | null;
	user_created?: User | string | null;
	date_created?: string | null;
	user_updated?: User | string | null;
	date_updated?: string | null;
	description?: string | null;
	verified?: boolean | null;
	license?: string | null;
	extension_type?: string | null;
	url_homepage?: string | null;
	url_repository?: string | null;
	date_published?: string | null;
	readme?: string | null;
	image?: File | string | null;
	content?: string | null;
	package_name?: string | null;
	url_npm?: string | null;
	slug?: string | null;
	name?: string | null;
	creator?: Creator | string | null;
	directus_registry_id?: string | null;
	total_downloads?: number | null;
}

export interface MarketplaceRequest {
	/** @required */
	id: string;
	timestamp?: string | null;
	email?: string | null;
	comments?: string | null;
	template?: Template | string | null;
	extension?: Extension | string | null;
	request_type?: 'template' | 'extension' | null;
}

export interface Template {
	/** @required */
	id: string;
	status?: 'published' | 'draft' | 'archived';
	sort?: number | null;
	user_created?: User | string | null;
	date_created?: string | null;
	user_updated?: User | string | null;
	date_updated?: string | null;
	slug?: string | null;
	description?: string | null;
	content?: string | null;
	image?: File | string | null;
	use_cases?: string[] | null | undefined;
	framework?: string | null | undefined;
	video?: Video | string | null;
	name?: string | null;
	template_status?: 'request' | 'in_progress' | 'available';
	creator?: Creator | string | null;
	url_github_repository?: string | null;
	url_frontend_demo?: string | null;
	url_backend_demo?: string | null;
	url_template?: string | null;
	instructions?: string | null;
	payment_type?: 'free' | 'paid' | null;
	price?: number | null;
	directus_plus?: boolean;
	has_frontend?: boolean;
	cloud_template?: boolean | null;
	image_gallery?: TemplateImage[] | string[] | null;
}

export interface TemplateImage {
	id: string;
	template: Template | string | null;
	file: File | string | null;
	sort?: number | null;
}
