import type { User, File } from './schema/system';
import type { Video } from './schema/content/video';

export type ExtensionType =
	| 'interface'
	| 'display'
	| 'layout'
	| 'module'
	| 'panel'
	| 'theme'
	| 'hook'
	| 'endpoint'
	| 'operation'
	| 'bundle';

export interface MarketplaceCreator {
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
	extensions?: MarketplaceExtension[] | string[];
	templates?: MarketplaceTemplate[] | string[];
}

export interface MarketplacePublisher {
	username: string;
	verified: boolean;
	id: string;
	name?: string;
	avatar?: string;
	github_username: string;
	github_name: string;
	github_blog: string;
	github_bio: string;
	github_location: string;
	github_company: string;
	github_avatar_url: string;
}

export interface MarketplaceVersion {
	version: string;
	package: string;
	publisher: string;
	type: string;
	host_version: string;
	publish_date: string;
	verified: boolean;
	id: string;
	url_repository: string | null;
	url_homepage: string | null;
	url_bugs: string | null;
	file_count: number;
	unpacked_size: number;
	sandbox: boolean;
	sandbox_requested_scopes: string[] | null;
	license: string;
	bundled: string[];
	maintainers: number[];
}

export interface MarketplaceExtension {
	name: string;
	description: string;
	verified: boolean;
	id: string;
	readme: string;
	type: ExtensionType;
	last_updated: string;
	host_version: string;
	total_downloads: number;
	sandbox: boolean;
	license: string;
	publisher: MarketplacePublisher;
	versions: MarketplaceVersion[];
	downloads?: Array<{ date: string; count: number }>;
	// Computed properties
	formatted_name?: string;
	formatted_description?: string;
	formatted_readme?: string;
	featured_image?: string;
	images?: string[];
	repository_url?: string;
	recent_downloads_7_days?: number;
	recent_downloads_30_days?: number;
}

export interface MarketplaceTemplate {
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
	creator?: MarketplaceCreator | string | null;
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
	template: MarketplaceTemplate | string | null;
	file: File | string | null;
	sort?: number | null;
}

export interface MarketplaceIntegration {
	name: string;
	description: string;
	slug: string;
	category: string;
	company_website: string;
	logo?: string;
	extensions: string[] | MarketplaceExtension[] | null;
	helpful_resources: Array<{
		title: string;
		url: string;
	}>;
	content: string;
	extensionDetails?: MarketplaceExtension[];
}

export interface MarketplaceRequest {
	/** @required */
	id: string;
	timestamp?: string | null;
	email?: string | null;
	comments?: string | null;
	template?: MarketplaceTemplate | string | null;
	extension?: MarketplaceExtension | string | null;
	request_type?: 'template' | 'extension' | null;
}

export interface MarketplaceResponse {
	data: MarketplaceExtension[];
	meta: {
		total_count: number;
		filter_count: number;
	};
}

export interface IntegrationsResponse {
	data: MarketplaceIntegration[];
	meta: {
		total_count: number;
		filter_count: number;
	};
	facets?: Array<{
		field: string;
		options: Array<{ value: string; count: number }>;
	}>;
}
