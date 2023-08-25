import type { Resource } from 'types/schema';

export const resourcePermalink = (resource?: Pick<Resource, 'type' | 'slug'> | null) => {
	if (!resource || !resource.type || !resource.slug || typeof resource.type === 'string') return null;

	return `/${resource.type.slug}/${resource.slug}`;
};
