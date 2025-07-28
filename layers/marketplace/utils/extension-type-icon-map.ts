import type { ExtensionType } from '~/types/marketplace';

export const extensionTypeIconMap: Record<ExtensionType, string> = {
	interface: 'design_services',
	display: 'label',
	layout: 'dataset',
	module: 'web',
	panel: 'analytics',
	theme: 'palette',
	hook: 'webhook',
	endpoint: 'api',
	operation: 'flowsheet',
	bundle: 'hub',
};
