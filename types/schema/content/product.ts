import type { File } from '../system/index.js';

export interface Product {
	/** @primaryKey */
	id: string;
	status?: 'active' | 'out_of_stock' | 'backordered' | 'hidden' | 'inactive';
	/** @description Name of this product */
	title?: string | null;
	/** @description Unique URL for this product */
	slug?: string | null;
	description?: string | null;
	/** @description Main thumbnail used for this product */
	thumbnail?: File | string | null;
	/** @description What colors are available? */
	color?: 'gray' | null;
	/** @description What sizes are available? */
	size?: 'gray' | null;
}
