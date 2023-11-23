<script setup lang="ts">
export interface BaseIconProps {
	/**
	 * Name of the Material Symbol to use.
	 * @see https://fonts.google.com/icons for all available icons
	 */
	name: string;

	/**
	 * Size of the icon. Controls both font size and optical size
	 * @values small, medium, large
	 */
	size?: 'x-small' | 'small' | 'medium' | 'large';

	/**
	 * Weight of the icon. Similar to font-weight
	 * @values 100, 200, 300, 400, 500, 600, 700
	 */
	weight?: number;
}

const props = withDefaults(defineProps<BaseIconProps>(), {
	size: 'medium',
	weight: 400,
});

const opticalSize = computed(() => {
	switch (props.size) {
		case 'x-small':
			return 16;
		case 'small':
			return 20;
		case 'medium':
		default:
			return 24;
		case 'large':
			return 48;
	}
});

const fontSize = computed(() => unref(opticalSize) + 'px');
</script>

<template>
	<span class="base-icon" :class="size">{{ name }}</span>
</template>

<style lang="scss" scoped>
.base-icon {
	--base-icon-color: var(--foreground);

	color: var(--base-icon-color);
	font-family: 'Material Symbols Outlined';
	font-weight: normal;
	font-style: normal;
	display: inline-block;
	line-height: 1;
	text-transform: none;
	letter-spacing: normal;
	word-wrap: normal;
	white-space: nowrap;
	direction: ltr;
	font-size: v-bind(fontSize);
	font-variation-settings:
		'opsz' v-bind(opticalSize),
		'wght' v-bind(weight);
	user-select: none;
}
</style>
