import type { Form } from '../../form.js';

export interface BlockHeroForm {
	id: string;
	form: string | Form | null;
	heading: string | null;
	subheading: string | null;
}
