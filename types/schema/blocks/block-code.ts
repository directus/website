export interface BlockCode {
	id: string;
	snippets:
		| null
		| {
				name: string;
				language: 'graphql' | 'http' | 'typescript' | 'sql' | 'json';
				snippet: string;
		  }[];
}
