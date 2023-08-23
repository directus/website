import type { Resource } from 'types/schema';

export const resourcePermalink = (resource?: Pick<Resource, 'type' | 'slug'> | null) => {
	if (!resource || !resource.type || !resource.slug) return null;

	return `/${resource.type}/${resource.slug}`;
};
