import type { File } from '../system';

export interface BlockMetric {
	id: string;
	value: string;
	description: string | null;
	image: string | File | null;
}
