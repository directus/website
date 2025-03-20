import type { DirectiveBinding, FunctionDirective, ObjectDirective } from 'vue';
import { useNuxtApp } from '#app';

interface CaptureEvent {
	name: string;
	properties?: Record<string, any>;
}

interface CaptureModifiers {
	click?: boolean;
	hover?: boolean;
}

interface EventHandler {
	event: string;
	handler: (_event: Event) => void;
}

const listeners = new WeakMap<HTMLElement, EventHandler[]>();

const directive: FunctionDirective<HTMLElement, CaptureEvent | string> = (
	el,
	binding: DirectiveBinding<CaptureEvent | string> & { modifiers: CaptureModifiers },
) => {
	const { value, modifiers } = binding;

	// Don't bind if the value is undefined
	if (!value) {
		return;
	}

	const { $posthog } = useNuxtApp();

	function capture(_event: Event) {
		if (!$posthog) return;

		if (typeof value === 'string') {
			$posthog.capture(value);
		}
		else {
			$posthog.capture(value.name, value.properties);
		}
	}

	// Determine the events to listen for based on the modifiers
	const events: string[] = [];

	if (Object.keys(modifiers).length === 0) {
		// Default to click if no modifiers are specified
		events.push('click');
	}
	else {
		if (modifiers.click) events.push('click');
		if (modifiers.hover) events.push('mouseenter');
	}

	// Remove existing event listeners
	if (listeners.has(el)) {
		const oldEvents = listeners.get(el) as EventHandler[];

		for (const { event, handler } of oldEvents) {
			el.removeEventListener(event, handler);
		}
	}

	// Add new event listeners and store them
	const eventHandlers = events.map((event) => {
		const handler = capture.bind(null);
		el.addEventListener(event, handler);
		return { event, handler };
	});

	listeners.set(el, eventHandlers);
};

export const vCapture: ObjectDirective = {
	mounted: directive,
	updated: directive,
	unmounted(el) {
		if (listeners.has(el)) {
			const eventHandlers = listeners.get(el) as EventHandler[];

			for (const { event, handler } of eventHandlers) {
				el.removeEventListener(event, handler);
			}

			listeners.delete(el);
		}
	},
};
