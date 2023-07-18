import type { ComponentButton } from './component-button.js';

export interface ComponentButtonGroup {
	id?: string;
	buttons?: (string | ComponentButton)[];
}
