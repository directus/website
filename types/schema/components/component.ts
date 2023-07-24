import type { ComponentButtonGroup } from './component-button-group';
import type { ComponentHeading } from './component-heading';
import type { ComponentMedia } from './component-media';
import type { ComponentMetrics } from './component-metrics';
import type { ComponentQuote } from './component-quote';

export type ComponentType = 'comp_button_group' | 'comp_heading' | 'comp_media' | 'comp_metrics' | 'comp_quote';

export type Component = ComponentButtonGroup | ComponentHeading | ComponentMedia | ComponentMetrics | ComponentQuote;
