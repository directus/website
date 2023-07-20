export interface Video {
	id: string;
	transcript: string | null;
	url: string | null;
	thumbnail: string | File | null;
	type: string | null;
	file: string | File | null;
}
