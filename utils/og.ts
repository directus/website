export async function getOgProps(baseUrl: string, collection: string, item = {} as any) {
	const props = { title: '', imageUrl: '', authorName: '', authorImage: '', badgeLabel: '' };

	switch (collection) {
		case 'resources':
			return {
				...props,
				title: item?.seo?.title ?? item?.title ?? 'Directus',
				imageUrl: `${baseUrl}/${item.image?.id}`,
				authorName: item.author?.name,
				authorImage: `${baseUrl}/${item.author?.image}`,
				badgeLabel: item?.category,
				publishedAt: item?.date_published
					? new Intl.DateTimeFormat('en-US', {
							dateStyle: 'full',
					  }).format(new Date(item?.date_published))
					: undefined,
			};
		case 'team':
			return {
				...props,
				title: item?.name ?? 'Directus Team Member',
				imageUrl: `${baseUrl}/${item.image?.id}`,
				badgeLabel: item?.job_title,
			};
		case 'pages':
			return {
				...props,
				title: item.seo?.title ?? item?.title ?? 'Directus',
				imageUrl: `${baseUrl}/ebdb1343-6ca9-4d66-bc3a-9598e06d8459`,
			};
		default:
			return props;
	}
}
