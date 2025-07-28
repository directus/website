import { micromark } from 'micromark';
import { gfm, gfmHtml } from 'micromark-extension-gfm';
import DOMPurify from 'isomorphic-dompurify';

export function markdownToHtml(markdown: string | null | undefined) {
	if (!markdown) return undefined;

	const html = micromark(markdown, {
		extensions: [gfm()],
		htmlExtensions: [gfmHtml()],
		allowDangerousHtml: true,
	});

	// Sanitize the HTML to prevent XSS while keeping safe tags like <picture>, <img>, etc.
	return DOMPurify.sanitize(html, {
		ALLOWED_TAGS: [
			'p',
			'br',
			'strong',
			'em',
			'h1',
			'h2',
			'h3',
			'h4',
			'h5',
			'h6',
			'ul',
			'ol',
			'li',
			'a',
			'code',
			'pre',
			'blockquote',
			'img',
			'picture',
			'source',
			'table',
			'thead',
			'tbody',
			'tr',
			'th',
			'td',
			'hr',
			'div',
			'span',
		],
		ALLOWED_ATTR: ['href', 'src', 'srcset', 'alt', 'title', 'media', 'class', 'id'],
	});
}

export function stripMarkdown(markdown: string | null | undefined): string {
	if (!markdown) return '';

	let text = markdown;

	// Remove headers (# ## ### etc.)
	text = text.replace(/^#{1,6}\s+/gm, '');

	// Remove links [text](url) -> text
	text = text.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');

	// Remove bold/italic **text** *text* -> text
	text = text.replace(/\*{1,2}([^*]+)\*{1,2}/g, '$1');
	text = text.replace(/_{1,2}([^_]+)_{1,2}/g, '$1');

	// Remove inline code `code` -> code
	text = text.replace(/`([^`]+)`/g, '$1');

	// Remove code blocks ```code``` -> code
	text = text.replace(/```[\s\S]*?```/g, '');
	text = text.replace(/~~~[\s\S]*?~~~/g, '');

	// Remove images ![alt](url) -> alt
	text = text.replace(/!\[([^\]]*)\]\([^)]+\)/g, '$1');

	// Remove strikethrough ~~text~~ -> text
	text = text.replace(/~~([^~]+)~~/g, '$1');

	// Remove horizontal rules
	text = text.replace(/^[-*_]{3,}$/gm, '');

	// Remove blockquotes > text -> text
	text = text.replace(/^>\s*/gm, '');

	// Remove list markers
	text = text.replace(/^\s*[-*+]\s+/gm, '');
	text = text.replace(/^\s*\d+\.\s+/gm, '');

	// Clean up extra whitespace
	text = text.replace(/\n{3,}/g, '\n\n');
	text = text.trim();

	return text;
}
