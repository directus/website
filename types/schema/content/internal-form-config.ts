import type { User } from '../system/index.js';
import type { Product } from './product.js';

export interface InternalFormConfig {
	/** @primaryKey */
	id: string;
	status?: 'published' | 'draft' | 'archived';
	sort?: number | null;
	user_created?: User | string | null;
	date_created?: string | null;
	user_updated?: User | string | null;
	date_updated?: string | null;
	Title?: string | null;
	slug?: string | null;
	description?: string | null;
	allow_multiple?: boolean | null;
	max_quantity?: number | null;
}

export interface InternalFormConfigProduct {
	/** @primaryKey */
	id: number;
	internal_form_config_id?: InternalFormConfig | string | null;
	products_id?: Product | string | null;
}
