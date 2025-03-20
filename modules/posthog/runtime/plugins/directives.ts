import { defineNuxtPlugin } from '#app';
import { vCapture } from '../directives/v-capture';

export default defineNuxtPlugin(({ vueApp }) => {
	vueApp.directive('capture', vCapture);
});
