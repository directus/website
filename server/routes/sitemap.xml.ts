import { SitemapStream, streamToPromise } from 'sitemap';

export default defineEventHandler(async () => {
	// TODO: Interate over all collections which have routes in Directus and add them to the sitemap.

	const sitemap = new SitemapStream({
		hostname: 'https://example.com',
	});

	for (const doc of docs) {
		sitemap.write({
			url: doc._path,
			changefreq: doc.seo.sitemap_change_frequency,
		});
	}
	sitemap.end();

	return streamToPromise(sitemap);
});
