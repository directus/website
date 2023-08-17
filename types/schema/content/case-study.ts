import type { File } from '../system';

export interface CaseStudy {
	id: string;
	title: string;
	company_name: string | null;
	company_logo: string | File | null;
	person_name: string | null;
	person_image: string | File | null;
	summary: string | null;
	image: string | File;
	content: string;
}
