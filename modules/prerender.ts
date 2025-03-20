import type { Schema } from '~/types/schema';
import { createDirectus, readItems, rest } from '@directus/sdk';
import { defineNuxtModule, extendRouteRules } from '@nuxt/kit';
import { withoutTrailingSlash } from 'ufo';

export default defineNuxtModule({
	async setup(_moduleOptions, nuxt) {
		const directusUrl = nuxt.options.runtimeConfig.public.directusUrl as string | undefined;
		const directusTvUrl = nuxt.options.runtimeConfig.public.tvUrl as string | undefined;

		if (!directusUrl || !directusTvUrl) {
			console.warn('Missing directusUrl or directusTvUrl in runtimeConfig');
			return;
		}

		const directus = createDirectus<Schema>(directusUrl).with(rest());
		const directusTv = createDirectus(directusTvUrl).with(rest());

		const permalinks = [];

		const pages = await directus.request(
			readItems('pages', {
				fields: ['permalink'],
				limit: -1,
			}),
		);

		const resources = await directus.request(
			readItems('resources', { fields: ['slug', { type: ['slug'] }], limit: -1 }),
		);

		const team = await directus.request(
			readItems('team', {
				// Filter for core team members or members with resources so we don't render like 100 empty pages
				filter: {
					_or: [
						{
							type: {
								_eq: 'core_team',
							},
						},
						{
							resources: {
								_nnull: true,
							},
						},
					],
				},
				fields: ['slug'],
				limit: -1,
			}),
		);

		const projects = await directus.request(readItems('projects', { fields: ['slug'], limit: -1 }));

		const agencyPartners = await directus.request(readItems('agency_partners', { fields: ['slug'], limit: -1 }));

		const features = await directus.request(readItems('features', { fields: ['slug'], limit: -1 }));

		const shows = await directusTv.request(readItems('shows', { fields: ['slug'], limit: -1 }));

		const episodes = await directusTv.request(
			readItems('episodes', { fields: ['slug', { season: ['*', { show: ['slug'] }] }], limit: -1 }),
		);

		const templates = await directus.request(readItems('templates', { fields: ['slug'], limit: -1 }));
		const creators = await directus.request(readItems('creators', { fields: ['slug'], limit: -1 }));

		permalinks.push(
			...pages.map((page) => page.permalink),
			...resources.map((resource) => `/${resource.type.slug}/${resource.slug}`),
			...team.map((member) => `/team/${member.slug}`),
			...projects.map((project) => `/built-with-directus/${project.slug}`),
			...agencyPartners.map((partner) => `/agency-directory/${partner.slug}`),
			...features.map((feature) => `/features/${feature.slug}`),
			...templates.map((template) => `/templates/${template.slug}`),
			...creators.map((creator) => `/creators/${creator.slug}`),
			...shows.map((show) => `/tv/${show.slug}`),
			...episodes.map((ep) => `/tv/${ep.season.show.slug}/${ep.slug}`),
			'/tv/all',
			'/tv',
			'/tv/live',
			'/rss.xml',
		);

		for (const link of permalinks) {
			extendRouteRules(withoutTrailingSlash(link), {
				prerender: true,
			});
		}
	},
});
