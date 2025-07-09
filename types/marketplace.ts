export interface MarketplacePublisher {
	username: string;
	verified: boolean;
	id: string;
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
	type: string;
	last_updated: string;
	host_version: string;
	total_downloads: number;
	sandbox: boolean;
	license: string;
	publisher: MarketplacePublisher;
	versions: MarketplaceVersion[];
	// Extra properties
	formatted_name?: string;
	formatted_readme?: string;
	featured_image?: string;
	images: string[];
}

export interface MarketplaceIntegration {
	id: string;
	name: string;
	description: string;
	logo: string;
	partner: string;
	type: string;
	metadata: Record<string, string>;
	extensions: MarketplaceExtension[];
	overview: string;
	helpful_resources: Array<{
		title: string;
		url: string;
	}>;
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
}
