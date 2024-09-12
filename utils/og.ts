export function getOgProps(baseUrl: string, collection: string, item = {} as any) {
	const props = { title: '', imageUrl: '', authorName: '', authorImage: '', badgeLabel: '' };

	switch (collection) {
		case 'resources':
			return {
				...props,
				title: item?.seo?.title ?? item?.title ?? 'Directus',
				imageUrl: `${baseUrl}/${item.image?.id}?format=jpeg`,
				authorName: item.author?.name,
				authorImage: `${baseUrl}/${item.author?.image}?format=jpeg`,
				badgeLabel: item?.category,
				publishedAt: item?.date_published
					? new Intl.DateTimeFormat('en-US', {
							dateStyle: 'full',
						}).format(new Date(item?.date_published))
					: null,
			};
		case 'team':
			return {
				...props,
				title: item?.name ?? 'Directus Team Member',
				imageUrl: `${baseUrl}/${item.image?.id}?format=jpeg`,
				badgeLabel: item?.job_title,
			};
		case 'pages':
			return {
				...props,
				title: item.seo?.title ?? item?.title ?? 'Directus',
				imageUrl: `${baseUrl}/ebdb1343-6ca9-4d66-bc3a-9598e06d8459`,
			};
		case 'agency_partners':
			return {
				...props,
				title: item.partner_name ?? 'Directus Agency Partner',
				imageUrl: `${baseUrl}/${item.partner_logo}?format=jpeg&width=800`,
				badgeLabel: `Directus Agency Partner`,
				publishedAt: item.region ? item?.region?.join(', ') : undefined,
			};

		case 'projects': {
			let imageUrl;

			if (item.website_screenshot) {
				imageUrl = `${baseUrl}/${item.website_screenshot}?format=jpeg&width=800`;
			} else if (item.featured_image) {
				imageUrl = `${baseUrl}/${item.featured_image}?format=jpeg&width=800`;
			}

			return {
				...props,
				title: item.project_title ?? 'Directus Project',
				imageUrl: imageUrl,
				badgeLabel: item.client_name,
			};
		}

		default:
			return props;
	}
}
