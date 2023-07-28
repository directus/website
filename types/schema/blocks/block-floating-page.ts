import type { File } from '../system/file.js';
import type { ComponentHeading } from '../components/component-heading.js';
import type { ComponentButton } from '../components/component-button.js';

export interface BlockFloatingPage {
	id: string;
	heading: ComponentHeading | null;
	content: string | null;
	button: ComponentButton | null;
	person_image: File | null;
	person_name: string | null;
	person_title: string | null;
}
