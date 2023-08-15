import type { Resource } from '../content';

export interface BlockResourceSlider {
	id: string;
	resources: number[] | BlockResourceSliderResources[];
}

export interface BlockResourceSliderResources {
	id: number;
	block_resource_slider_id: string;
	resources_id: Resource | string;
}
