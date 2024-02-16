import type { ThemeInput } from 'shiki';
import { getHighlighter } from 'shiki';
import lightTheme from '~/assets/shiki/directus-light.json';
import darkTheme from '~/assets/shiki/directus-dark.json';

interface CodeHighlighterBody {
	snippet: string;
	language: string;
	background: string;
}

export default defineEventHandler(async (event) => {
	const body = await readBody(event);

	const { snippet, language, background } = body as CodeHighlighterBody;

	try {
		const shiki = await getHighlighter({
			themes: [lightTheme as unknown as ThemeInput, darkTheme as unknown as ThemeInput],
			langs: ['graphql', 'http', 'typescript', 'sql', 'json'],
		});

		const codeSnippet = shiki.codeToHtml(snippet, {
			lang: language,
			theme: background === 'dark-night' ? 'directus-dark' : 'directus-light',
		});

		return {
			html: codeSnippet,
		};
	} catch (error: any) {
		return {
			status: 500,
			error: error.message,
		};
	}
});
