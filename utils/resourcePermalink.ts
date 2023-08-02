export const resourcePermalink = (
	resource?: { type: 'case_study' | 'article' | 'video' | null; slug: string | null } | null
) => {
	if (!resource || !resource.type || !resource.slug) return null;

	return `/${resource.type}/${resource.slug}`;
};
