import chrome from '@sparticuz/chromium';
import puppeteer from 'puppeteer-core';
import { createSSRApp } from 'vue';
import { renderToString } from 'vue/server-renderer';
import OgImage from '../../../../../dist/og.js';
import css from '../../../../../dist/style.js';
import { directus, readItem } from '../../../../lib/directus';

const exePath = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

const IMAGE_BASE_URL = 'http://marketing.directus.app/assets';
const VIEWPORT = { width: 1200, height: 630, deviceScaleFactor: 2 };
const CLIP = { x: 0, y: 0, ...VIEWPORT };

async function getOptions(isDev: boolean) {
	if (isDev) {
		return {
			product: 'chrome',
			args: [],
			executablePath: exePath,
			headless: true,
		};
	}

	return {
		product: 'chrome',
		args: chrome.args,
		executablePath: await chrome.executablePath,
		headless: chrome.headless,
	};
}

async function getProps(collection: string, item = {} as any) {
	const props = { title: '', imageUrl: '', authorName: '', authorImage: '', badgeLabel: '' };

	switch (collection) {
		case 'resources':
			return {
				...props,
				title: item.title,
				imageUrl: `${IMAGE_BASE_URL}/${item.image.id}`,
				authorName: item.author.name,
				authorImage: `${IMAGE_BASE_URL}/${item.author.image}`,
				badgeLabel: item.category,
			};
		case 'team':
			return {
				...props,
				title: item.name,
				imageUrl: `${IMAGE_BASE_URL}/${item.image.id}`,
				badgeLabel: item.job_title,
			};
		case 'pages':
			return {
				...props,
				title: item.title,
				imageUrl: `${IMAGE_BASE_URL}/ebdb1343-6ca9-4d66-bc3a-9598e06d8459`,
			};
		default:
			return props;
	}
}

type Collection = 'resources' | 'team' | 'pages';

export default defineEventHandler(async (event) => {
	const { collection, id } = getRouterParams(event);
	if (!collection || !id) throw new Error('Missing collection or id');

	const item = await directus.request(
		readItem(collection as Collection, id, {
			// @ts-ignore - I can't figure out how to properly type this when the collection is dynamic.
			fields: ['*', '*.*'],
		})
	);

	const props = await getProps(collection, item);

	// Switch to this once we have a proper staging environment.
	// const options = await getOptions(process.env.NUXT_PUBLIC_SITE_URL?.includes('localhost') ?? false);
	const options = await getOptions(false);

	const app = createSSRApp(OgImage, props);
	const html = await renderToString(app);

	const doc = `
		<html>
			<head><style>${css}</style></head>
			<body>${html}</body>
		</html>
	`;

	const browser = await puppeteer.launch(options as any);
	const page = await browser.newPage();
	await page.setViewport(VIEWPORT);
	await page.setContent(doc);

	const screenshot = await page.screenshot({ type: 'jpeg', quality: 100, clip: CLIP });
	await browser.close();

	event.node.res.setHeader('Content-Type', 'image/jpeg');
	event.node.res.end(screenshot);
});
