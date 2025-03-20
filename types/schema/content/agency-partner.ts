import type { File, User } from '../system';

export interface AgencyPartner {
	id: string;
	status: 'published' | 'draft' | 'archived';
	user_created: string | User;
	date_created: string;
	user_updated: string | User | null;
	date_updated: string | null;
	partner_name: string;
	slug: string;
	tier: 'basic' | 'bronze' | 'silver' | 'gold';
	partner_logo: string | File | null;
	short_description: string;
	description: string;
	website: string;
	links:
		| {
			label?: string;
			description?: string;
			url?: string;
		}[]
		| null;
	country: string | null;
	region: string[] | null;
	team_size: string;
	specializations: string[];
	projects: string[] | Project[] | null;
	contact_first_name: string;
	contact_last_name: string;
	contact_email: string;
	website_screenshot: string | File | null;
	website_metadata: string | null;
}

export interface Project {
	id: string;
	status: 'published' | 'draft' | 'archived';
	user_created: string | User;
	date_created: string;
	user_updated: string | User | null;
	date_updated: string | null;
	date_published: string | null;
	project_title: string;
	slug: string;
	client_name: string;
	website: string;
	featured_image: string | File;
	short_summary: string;
	content: string;
	built_with: string[];
	image_gallery: string[] | ProjectFile[] | null;
	website_screenshot: string | File | null;
	website_metadata: string | null;
	partner: string | AgencyPartner | null;
	use_cases: string[] | null;
}

export interface ProjectFile {
	id: string;
	projects_id: string | Project;
	directus_files_id: string | File;
}
