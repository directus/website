<script setup lang="ts">
import { File } from '~/types/schema';

export interface BaseImageProps {
	/**
	 * Sizes for srcset. Syntax is '375px:preset_name 768px:preset_name'
	 */
	sizes?: string;

	/**
	 * The key for the Directus image preset if you're not using sizes.
	 */
	preset?: string;

	/* Standard <img> attributes */
	src: string | File | null | undefined;
	alt?: string;
	width?: string | number;
	height?: string | number;
	loading?: 'lazy' | 'eager' | 'auto';
}

// @TODO Add support for srcset and sizes props
const srcsetSizes = computed(() => {
	const sizes = unref(props.sizes);
	if (!sizes) return null;

	const sizesArray = sizes.split(' ');

	const sizesValue = sizesArray
		.map((size, index) => {
			const [width, preset] = size.split(':');
			if (index === sizesArray.length - 1) return `${width}`;
			else return `(max-width: ${width}) ${width}`;
		})
		.join(', ');

	const srcsetValue = sizesArray
		.map((size) => {
			let [width, preset] = size.split(':');
			width = width.replace('px', '');
			return `${getFileUrl(props.src)}&key=${preset} ${width}w`;
		})
		.join(', ');

	return {
		sizes: sizesValue,
		srcset: srcsetValue,
	};
});

const props = defineProps<BaseImageProps>();
</script>

<template>
	<img
		:src="getFileUrl(src)"
		:alt="alt!"
		:width="width!"
		:height="height!"
		:loading="loading!"
		:sizes="srcsetSizes?.sizes"
		:srcset="srcsetSizes?.srcset"
	/>
</template>
