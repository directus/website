import { micromark } from 'micromark';
import { gfm, gfmHtml } from 'micromark-extension-gfm';

export function markdownToHtml(markdown: string | null | undefined) {
	if (!markdown) return undefined;
	return micromark(markdown, {
		extensions: [gfm()],
		htmlExtensions: [gfmHtml()],
	});
}
