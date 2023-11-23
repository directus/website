import { createDirectus, readItems, rest } from '@directus/sdk';
import { Feed } from 'feed';
import { micromark } from 'micromark';
import { gfm, gfmHtml } from 'micromark-extension-gfm';

import type { Schema } from '~/types/schema';
import type { DeveloperArticle, Resource, User, Team, ContentType } from '~/types/schema/';

const feed = new Feed({
	title: 'Directus',
	description:
		'The official Directus content feed. Stay up to speed with the latest Directus news, releases, and tutorials from our developer blog.',
	copyright: `© ${new Date().getFullYear()} Monospace Inc.`,
	image: 'https://marketing.directus.app/assets/54c69e23-b8af-4aa8-abc5-2d3544bb7c23.png',
	favicon: 'https://directus.io/favicon.ico',
	id: 'https://directus.io',
	link: 'https://directus.io',
	author: {
		name: 'Directus Team',
	},
});

function markdownToHtml(markdown: string) {
	if (!markdown) return undefined;
	return micromark(markdown, {
		extensions: [gfm()],
		htmlExtensions: [gfmHtml()],
	});
}

function convertDate(date: string | null | undefined) {
	if (!date) return new Date();
	const dateObject = new Date(date);
	return dateObject;
}

export default defineEventHandler(async (event) => {
	const {
		public: { directusUrl },
	} = useRuntimeConfig();

	const directus = createDirectus<Schema>(directusUrl).with(rest());

	const posts = await directus.request(
		readItems('resources', {
			fields: [
				'image',
				'title',
				'summary',
				'slug',
				'category',
				'date_published',
				{ author: ['image', 'name', 'slug'] },
				{ type: ['slug'] },
			],
			limit: 20,
			sort: ['-date_published'],
		}),
	);

	const devBlogPosts = await directus.request(
		readItems('developer_articles', {
			fields: [
				'image',
				'title',
				'summary',
				'content',
				'slug',
				'date_published',
				{ author: ['first_name', 'last_name', 'avatar'] },
			],
			limit: 20,
			sort: ['-date_published'],
			filter: {
				status: { _eq: 'published' },
			},
		}),
	);

	for (const post of posts as Resource[]) {
		const type = post.type as ContentType;
		const author = post.author as Team;

		feed.addItem({
			title: post.title,
			description: post.summary ?? '',
			id: `https://directus.io/${type.slug}/${post.slug}`,
			link: `https://directus.io/${type.slug}/${post.slug}`,
			date: convertDate(post.date_published as string),
			image: `${directusUrl}/assets/${post.image}`,
			author: [
				{
					name: author.name ?? 'Directus Team',
					link: `https://directus.io/team/${author.slug}` ?? 'https://directus.io/',
				},
			],
			content: `<p>${post.summary}</p><p>-------</p><p><a href="https://directus.io/${type.slug}/${post.slug}">Read the full post on the Directus website -></a></p>`,
		});
	}

	for (const post of devBlogPosts as DeveloperArticle[]) {
		const author = post.author as User;

		feed.addItem({
			title: post.title,
			description: post.summary ?? '',
			id: `https://docs.directus.io/blog/${post.slug}`,
			link: `https://docs.directus.io/blog/${post.slug}`,
			date: convertDate(post.date_published as string),
			author: [
				{
					name: author ? `${author?.first_name} ${author?.last_name}` : 'Directus Team',
				},
			],
			image: `${directusUrl}/assets/${post.image}`,
			content: markdownToHtml(post.content),
		});
	}

	const feedString = feed.atom1();

	event.node.res.setHeader('Content-Type', 'text/xml');
	event.node.res.end(feedString);
});
