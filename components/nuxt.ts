import { addComponent, createResolver, defineNuxtModule } from '@nuxt/kit';

export interface ModuleOptions {
	/** Watch and (re-)build components in Nuxt dev mode */
	dev: boolean;
}

export default defineNuxtModule<ModuleOptions>({
	async setup(options, nuxt) {
		if (nuxt.options.dev && options.dev) {
			const { resolve } = createResolver(import.meta.url);
			const rootDir = resolve('.');
			const cwd = process.cwd();

			// Vite produces wrong bundle if not in root dir
			process.chdir(rootDir);

			const { build } = await import('vite');

			const watcher = await build({
				root: rootDir,
				build: {
					watch: {},
				},
			});

			// Wait for initial build
			if ('on' in watcher) {
				await new Promise((resolve) => {
					watcher.on('event', ({ code }) => {
						if (code === 'BUNDLE_END') {
							resolve(true);
						}
					});
				});

				process.chdir(cwd);

				// Restart Nuxt when rebundled to adopt changes
				watcher.on('event', ({ code }) => {
					if (code === 'BUNDLE_END') {
						nuxt.callHook('restart');
					}
				});
			}
		}

		try {
			// @ts-ignore
			const components = await import('@directus/website-components');

			for (const component in components) {
				addComponent({
					name: component,
					export: component,
					filePath: '@directus/website-components',
				});
			}

			nuxt.options.css.push('@directus/website-components/theme', '@directus/website-components/style');
		} catch {
			// eslint-disable-next-line no-console
			console.warn(`Components not loaded because it hasn't been built yet`);
		}
	},
});
