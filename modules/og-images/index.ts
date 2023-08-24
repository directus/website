import {
	createResolver,
	defineNuxtModule,
	addServerHandler,
	addComponent,
	addPrerenderRoutes,
	useLogger,
} from 'nuxt/kit';

import { directus, readItems } from './runtime/lib/directus';

export default defineNuxtModule({
	meta: {
		name: 'og-images',
	},
	async setup(_moduleOptions, nuxt) {
		const logger = useLogger('og-images');
		const { resolve } = createResolver(import.meta.url);

		// Add the component
		await addComponent({
			name: 'OgImage',
			filePath: resolve('./runtime/components/OgImage.vue'),
		});

		// Add the server route that returns the image
		await addServerHandler({
			route: '/_og/:collection/:id',
			handler: resolve('./runtime/server/routes/_og/[collection]/[id].get.ts'),
		});

		const resources = await directus.request(
			readItems('resources', { fields: ['id', 'slug', { type: ['slug'] }], limit: -1 })
		);

		const pages = await directus.request(
			readItems('pages', {
				fields: ['id', 'permalink'],
				limit: -1,
			})
		);

		// const team = await directus.request(readItems('team', { fields: ['id', 'slug'], limit: -1 }));

		const permalinks = [
			...resources.map((resource) => `/_og/resources/${resource.slug}`),
			...pages.map((page) => `/_og/pages/${page.permalink}`),
			// ...team.map((member) => ({ permalink: `/team/${member.slug}` })),
		];

		// Prerender the routes
		nuxt.hook('nitro:config', async (nitroConfig) => {
			nitroConfig?.prerender?.routes?.push(...permalinks);
		});
	},
});
