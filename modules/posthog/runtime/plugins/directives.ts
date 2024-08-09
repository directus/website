import { vCapture } from '../directives/v-capture';
import { defineNuxtPlugin } from '#app';

export default defineNuxtPlugin(({ vueApp }) => {
	vueApp.directive('capture', vCapture);
});
