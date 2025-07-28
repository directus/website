export interface TypesenseNode {
	host: string;
	port: number;
	protocol: string;
	path?: string;
}

export function parseTypesenseUrl(url: string): TypesenseNode {
	// Handle Typesense Cloud URLs (e.g., xxx.typesense.net)
	const parsedUrl = new URL(/^https?:\/\//i.test(url) ? url : `https://${url}`);

	if (url.includes('typesense.net')) {
		return {
			host: parsedUrl.hostname,
			port: 443,
			protocol: 'https',
		};
	}

	try {
		// Only add https:// if the URL doesn't start with http:// or https://
		const parsedUrl = new URL(/^https?:\/\//i.test(url) ? url : `https://${url}`);
		return {
			host: parsedUrl.hostname,
			port: parseInt(parsedUrl.port) || (parsedUrl.protocol === 'https:' ? 443 : 8108),
			protocol: parsedUrl.protocol.replace(':', ''),
			path: parsedUrl.pathname === '/' ? undefined : parsedUrl.pathname,
		};
	} catch {
		// Fallback for non-URL format (e.g., "localhost:8108")
		const [host, port = '8108'] = url.split(':');
		return {
			host: host || 'localhost',
			port: parseInt(port),
			protocol: 'http',
		};
	}
}
