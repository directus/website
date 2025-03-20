export function slugify(str: string): string {
	return str
		.toLowerCase()
		.replaceAll(' ', '-')
		.replaceAll(/[^a-z0-9-]/g, '');
}
