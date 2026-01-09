import type { User } from '../system/index.js';
import type { InternalFormConfig } from './internal-form-config.js';

export interface Form {
	/** @primaryKey */
	id: string;
	sort: number | null;
	user_created: string | User | null;
	date_created: string | null;
	user_updated: string | User | null;
	date_updated: string | null;
	type?: 'hubspot' | 'typeform' | 'internal' | null;
	title?: string | null;
	hubspot_form_id?: string | null;
	route_to_meeting_link_on_success?: boolean | null;
	typeform_form_id?: string | null;
	internal_form_url?: string | null;
	form_config?: InternalFormConfig | string | null;
}
