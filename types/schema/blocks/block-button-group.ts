import type { Experiment, ExperimentVariant } from '../meta/experiment.js';
import type { BlockButton } from './block-button';

export interface BlockButtonGroup {
	id: string;
	buttons: number[] | BlockButtonGroupBlockButton[] | null;
	alignment: 'left' | 'center' | null;
	style: 'default' | 'pill';
	experiment_enabled?: boolean | null;
	parent?: BlockButtonGroup | string | null;
	experiment?: Experiment | string | null;
	experiment_variant?: ExperimentVariant | string | null;
	variants?: BlockButtonGroup[] | string[];
}

export interface BlockButtonGroupBlockButton {
	id: string;
	block_button_group_id: BlockButtonGroup | string;
	block_button_id: BlockButton | string;
	sort: number | null;
}

export interface ButtonGroupWithExperiment {
	id: string;
	alignment: 'left' | 'center' | null;
	style: 'default' | 'pill';
	experiment_enabled?: boolean | null;
	experiment?: { id: string; feature_flag: string };
	experiment_variant?: { id: string; key: string };
	buttons?: Array<{ id: string; block_button_id: string }>;
	variants?: Array<{
		id: string;
		alignment: 'left' | 'center' | null;
		style: 'default' | 'pill';
		experiment_variant?: { id: string; key: string };
		buttons?: Array<{ id: string; block_button_id: string }>;
	}>;
}
