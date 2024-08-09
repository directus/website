export interface Experiment {
	id: string;
	sort: number | null;
	status: 'draft' | 'active' | 'archived';
	name: string;
	description: string | null;
	feature_flag: string;
	experiment_type: 'page' | 'feature';
	posthog_experiment_id: string | null;
	variants: ExperimentVariant[];
}

export interface ExperimentVariant {
	id: string;
	sort: number | null;
	experiment: Experiment;
	key: string;
	description: string | null;
	url?: string | null;
}

export interface FeatureFlagPayload {
	experiment_type?: 'page' | 'feature';
	control_path?: string;
	path?: string;
}
