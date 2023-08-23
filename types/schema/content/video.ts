import type { File } from '../system';

export interface Video {
	id: string;
	transcript: string | null;
	url: string | null;
	thumbnail: string | File | null;
	type: string | null;
	file: string | File | null;
	autoplay: boolean;
	controls: boolean;
	loop: boolean;
	series: string | null;
}
