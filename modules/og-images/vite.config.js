import vue from '@vitejs/plugin-vue';
import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import fs from 'fs';

function cssToJsPlugin() {
	return {
		name: 'css-to-js', // name of the plugin
		writeBundle() {
			const inputCSSPath = './dist/style.css'; // Replace with your CSS file path
			const outputJSPath = './dist/style.js'; // Replace with your desired output JS file path

			// Read the content of the CSS file
			const cssData = fs.readFileSync(inputCSSPath, 'utf8');

			// Escape double quotes and backslashes
			// const escapedData = cssData.replace(/(["\\])/g, '\\$1');

			// Create the export string
			const outputData = `export default \`${cssData}\``;

			// Write the output to the JS file
			fs.writeFileSync(outputJSPath, outputData, 'utf8');
		},
	};
}

export default defineConfig({
	plugins: [vue(), cssToJsPlugin()],
	build: {
		lib: {
			entry: resolve(__dirname, './runtime/components/OgImage.vue'),
			name: 'OgImage',
		},
		rollupOptions: {
			external: ['vue'],
			output: {
				globals: {
					vue: 'Vue',
				},
			},
		},
	},
});
