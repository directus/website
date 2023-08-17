import type { File } from '../system';

export interface BlockSignature {
	id: string;
	person_image: string | File;
	person_name: string;
	person_title: string;
}
