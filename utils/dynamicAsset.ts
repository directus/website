export const dynamicAsset = (path: string) => {
	const assets = import.meta.glob<{ default?: string }>('~/assets/**/*', { eager: true });
	const fullPath = `/assets` + path;
	return assets?.[fullPath]?.default;
};
