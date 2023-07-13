import { defineNuxtPlugin } from '#app';
import * as components from './src/index.ts';

export default defineNuxtPlugin((nuxtApp) => {
	for (const [name, component] of Object.entries(components)) {
		nuxtApp.vueApp.component(name, component);
	}
});
