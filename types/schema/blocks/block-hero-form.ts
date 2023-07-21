import type { Form } from '../content/form.js';

export interface BlockHeroForm {
	id: string;
	form: string | Form | null;
	heading: string | null;
	subheading: string | null;
}
