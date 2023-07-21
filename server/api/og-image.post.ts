/* eslint-disable no-console */

// import playwright from 'playwright-aws-lambda';
// import FormData from 'form-data';
// import { readBody } from 'h3';

// Aspect ratios for social media images
// OG Image: 1.91:1
// Square: 1:1
// const viewportSettings = {
// 	'og:image': {
// 		width: 1200,
// 		height: 630,
// 	},
// 	square: {
// 		width: 850,
// 		height: 850,
// 	},
// };

export default defineEventHandler(async (_event) => {
	/**
	 * @TODO
	 */
	// try {
	// 	const $directus = ''; /** @TODO: Initialize Directus SDK */
	// 	const body = await readBody(event);
	// 	const { seo, slug, url } = body;
	// 	// Initialize the browser
	// 	const browser = await playwright.launchChromium({
	// 		headless: true,
	// 	});
	// 	const context = await browser.newContext();
	// 	const page = await context.newPage();
	// 	await page.goto(url);
	// 	// Wait for the page to load
	// 	await page.waitForSelector('body');
	// 	// Take a screenshot of the page
	// 	const screenshot = await page.screenshot({
	// 		type: 'jpeg',
	// 		quality: 100,
	// 		clip: {
	// 			x: 0,
	// 			y: 0,
	// 			...viewportSettings['og:image'],
	// 		},
	// 	});
	// 	// Close the browser instance
	// 	await browser.close();
	// 	// Get timestamp for filename
	// 	const timestamp = new Date().toISOString();
	// 	const form = new FormData();
	// 	form.append('file', screenshot, `item-${slug}-${timestamp}.jpg`);
	// 	// Upload the screenshot to Directus
	// 	const fileId = await $directus.files.createOne(form);
	// 	// Update the post.seo with the screenshot
	// 	await $directus.items('seo').updateOne(seo, {
	// 		og_image: fileId,
	// 	});
	// 	return {
	// 		statusCode: 200,
	// 		fileId: fileId,
	// 	};
	// } catch (error) {
	// 	console.error(error);
	// 	return error;
	// }
});
