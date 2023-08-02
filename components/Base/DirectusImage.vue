<script setup lang="ts">
const {
	public: { directusUrl, directusToken },
} = useRuntimeConfig();

export interface DirectusImageProps {
	/**
	 * Directus File ID
	 */
	uuid: string;

	/**
	 * Alt text for image
	 */
	alt: string;

	/**
	 * Sizes for srcset. Syntax is '375px:preset_name 768px:preset_name'
	 */
	sizes?: string | null | undefined;

	/**
	 * The key for the Directus image preset if you're not using sizes.
	 */
	preset?: string | null | undefined;

	/**
	 * Width of the image
	 */
	width?: string | number;

	/**
	 * Height of the image
	 */
	height?: string | number;

	/**
	 * Lazy load the image
	 */
	loading?: 'lazy' | 'eager' | 'auto';
}

const props = defineProps<DirectusImageProps>();

const src = computed(() => {
	const url = new URL(`/assets/${props.uuid}`, directusUrl);
	url.searchParams.set('token', directusToken);

	if (!props.sizes && props.preset) {
		url.searchParams.set('key', props.preset);
	}

	return url.toString();
});

const srcsetAttr = computed(() => {
	const sizes = unref(props.sizes);
	if (!sizes) return null;

	const sizesArray = sizes.split(' ');

	const srcsetValue = sizesArray
		.map((size) => {
			let [width, preset] = size.split(':');
			width = width.replace('px', '');

			// Use URLSearchParams to encode the preset name
			const url = new URL(unref(src));
			url.searchParams.set('key', preset);

			return `${url.toString()} ${width}w`;
		})
		.join(', ');

	return srcsetValue;
});

const sizesAttr = computed(() => {
	const sizes = unref(props.sizes);
	if (!sizes) return null;

	const sizesArray = sizes.split(' ');

	const sizesValue = sizesArray
		.map((size, index) => {
			const [width] = size.split(':');
			if (index === sizesArray.length - 1) return `${width}`;
			else return `(max-width: ${width}) ${width}`;
		})
		.join(', ');

	return sizesValue;
});
</script>

<template>
	<img
		:src="src"
		:alt="alt"
		:srcset="srcsetAttr!"
		:sizes="sizesAttr!"
		:height="height"
		:width="width"
		:loading="loading"
	/>
</template>
