export function convertIconName(name: string): string | null | undefined {
	if (!name) return;
	// Convert the icon coming from the API to the name of the icon component
	// Directus uses Google Material Icons and the icon values are snake_case (e.g. "account_circle")
	const prefix = 'material-symbols:';
	// Change snake case to kebab case
	const kebabCase = name.replace(/_/g, '-');
	const iconName = prefix + kebabCase;
	return iconName;
}
