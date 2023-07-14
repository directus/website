import { addPlugin, createResolver, defineNuxtModule } from '@nuxt/kit';

export default defineNuxtModule({
	async setup() {
		const { resolve } = createResolver(import.meta.url);

		addPlugin(resolve('./nuxt.plugin.js'));
	},
});
