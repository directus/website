export interface BlockColumns {
	id?: string;
	col_one?: (string | BlockColumnsColumn)[];
	col_two?: (string | BlockColumnsColumn)[];
}

export interface BlockColumnsColumn {
	id?: string;
	block_columns_id?: (string | BlockColumns) | null;
	item?: (string | { [key: string]: any })[] | null;
	sort?: number | null;
	collection?: string | null;
}
