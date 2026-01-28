function getAssetUrl(baseUrl: string, assetId?: string | null) {
	if (!assetId) return undefined;
	return `${baseUrl}/${assetId}?format=jpeg&width=800`;
}

export function getOgProps(baseUrl: string, collection: string, item = {} as any) {
	const props = { title: '', imageUrl: undefined, authorName: '', authorImage: undefined, badgeLabel: '' };

	switch (collection) {
		case 'resources':
			return {
				...props,
				title: item?.seo?.title ?? item?.title ?? 'Directus',
				imageUrl: getAssetUrl(baseUrl, item.image?.id),
				authorName: item.author?.name,
				authorImage: getAssetUrl(baseUrl, item.author?.image),
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
				imageUrl: getAssetUrl(baseUrl, item.image?.id),
				badgeLabel: item?.job_title,
			};
		case 'pages':
			return {
				...props,
				title: item.seo?.title ?? item?.title ?? 'Directus',
				imageUrl: getAssetUrl(baseUrl, 'ebdb1343-6ca9-4d66-bc3a-9598e06d8459'),
			};
		case 'agency_partners':
			return {
				...props,
				title: item.partner_name ?? 'Directus Agency Partner',
				imageUrl: getAssetUrl(baseUrl, item.partner_logo),
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

		case 'templates': {
			return {
				...props,
				title: item.name ?? 'Directus Template',
				imageUrl: getAssetUrl(baseUrl, item.image?.id),
				badgeLabel: 'Directus Template',
				publishedAt: item.description,
				authorName: userName(item.creator),
				authorImage: getAssetUrl(baseUrl, item.creator?.avatar),
			};
		}

		default:
			return props;
	}
}
