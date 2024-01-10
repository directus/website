import type { User } from '../system/index.js';

export interface Form {
	id: string;
	sort: number | null;
	user_created: string | User | null;
	date_created: string | null;
	user_updated: string | User | null;
	date_updated: string | null;
	type: string | null;
	title: string | null;
	hubspot_form_id: string | null;
	typeform_form_id: string | null;
	route_to_meeting_link_on_success: boolean | null;
}
