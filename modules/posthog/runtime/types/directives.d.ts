import type { ObjectDirective } from 'vue';
import type { Property } from 'posthog-js';

declare global {
	export interface CaptureEvent {
		/**
		 * Event name
		 *
		 * @docs https://posthog.com/docs/product-analytics/capture-events
		 */
		name: string;

		/**
		 * Event properties
		 *
		 * @docs https://posthog.com/docs/product-analytics/capture-events#setting-event-properties
		 */
		properties?: Record<string, Property>;
	}

	export interface CaptureModifiers {
		/**
		 * Click event modifier
		 */
		click?: boolean;

		/**
		 * Hover event modifier
		 */
		hover?: boolean;
	}
}

declare module 'vue' {
	export interface ComponentCustomProperties {
		vCapture: ObjectDirective<HTMLElement, CaptureEvent | string>;
	}
}

export {};
