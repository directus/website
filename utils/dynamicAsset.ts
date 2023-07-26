export const dynamicAsset = (path: string) => {
	const assets = import.meta.glob('~/assets/**/*', { eager: true });
	const fullPath = `/assets` + path;
	return assets[fullPath]?.default;
};
