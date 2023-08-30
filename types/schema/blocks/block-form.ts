import type { Form } from '../content';

export interface BlockForm {
	id: string;
	form: string | Form;
	show_labels: boolean;
	inline: boolean;
}
