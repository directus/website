import type { File } from '../system/file.js';
import type { ComponentHeading } from '../components/component-heading.js';
import type { ComponentButton } from '../components/component-button.js';

export interface BlockFloatingPage {
	id: string;
	heading: ComponentHeading | null;
	content: string | null;
	image: File | null;
	button: ComponentButton | null;
}
