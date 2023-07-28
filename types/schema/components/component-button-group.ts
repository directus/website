import type { ComponentButton } from './component-button.js';

export interface ComponentButtonGroup {
	id: string;
	size: 'small' | 'medium' | 'large';
	buttons: string[] | ComponentButton[];
}
