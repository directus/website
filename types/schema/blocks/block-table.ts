export interface BlockTable {
	id: string;
	title: string;
	columns: { label: string }[];
	rows: { name: string; tooltip: string; cols: { value: string; tooltip: string }[] }[];
}
