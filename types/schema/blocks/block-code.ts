export interface BlockCode {
	id: string;
	background: 'transparent' | 'colorful' | 'dark-night';
	snippets:
		| null
		| {
			name: string;
			language: 'graphql' | 'http' | 'typescript' | 'sql' | 'json';
			snippet: string;
		}[];
}
