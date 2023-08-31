import type { BlockMetric } from './block-metric';

export interface BlockMetricGroup {
	id: string;
	items: number[] | BlockMetricGroupItems[];
	background: 'transparent' | 'pristine-white';
}

export interface BlockMetricGroupItems {
	id: number;
	block_metric_id: string | BlockMetric;
	block_metric_group_id: string | BlockMetricGroup;
	sort: number | null;
}
