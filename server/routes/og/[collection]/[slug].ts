import chrome from '@sparticuz/chromium';
import puppeteer from 'puppeteer-core';

const exePath = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

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

export default defineEventHandler(async (event) => {
	const params = getRouterParams(event);
	const options = await getOptions(process.env.HOST_NAME.includes('localhost') ?? false);
	const browser = await puppeteer.launch(options);

	const page = await browser.newPage();

	await page.setViewport({
		width: 1200,
		height: 630,
		deviceScaleFactor: 2,
	});

	await page.goto(`http://localhost:3000/_image/${params.collection}/${params.slug}`);

	const screenshot = await page.screenshot({
		type: 'jpeg',
		quality: 100,
		clip: {
			x: 0,
			y: 0,
			width: 1200,
			height: 630,
		},
	});

	await browser.close();

	event.node.res.setHeader('Content-Type', 'image/jpeg');
	event.node.res.end(screenshot);
});
