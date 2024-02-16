/* eslint-disable no-console */

import { createDirectus, readItems, rest } from '@directus/sdk';
import { defineNuxtModule, extendRouteRules } from '@nuxt/kit';
import { withoutTrailingSlash } from 'ufo';
import type { Schema } from '~/types/schema';

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
								_eq: 'core-team',
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

		const shows = await directusTv.request(readItems('shows', { fields: ['slug'], limit: -1 }));

		const episodes = await directusTv.request(
			readItems('episodes', { fields: ['slug', { season: ['*', { show: ['slug'] }] }], limit: -1 }),
		);

		permalinks.push(...pages.map((page) => page.permalink));
		permalinks.push(...resources.map((resource) => `/${resource.type.slug}/${resource.slug}`));
		permalinks.push(...team.map((member) => `/team/${member.slug}`));
		permalinks.push(...shows.map((show) => `/tv/${show.slug}`));
		permalinks.push(...episodes.map((ep) => `/tv/${ep.season.show.slug}/${ep.slug}`));

		for (const link of permalinks) {
			extendRouteRules(withoutTrailingSlash(link), {
				prerender: true,
			});
		}
	},
});
