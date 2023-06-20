<script setup lang="ts">
import { computed, unref } from 'vue';

export interface BaseIconProps {
	/**
	 * Name of the Material Symbol to render
	 */
	name: string;

	/**
	 * Standardized font-size and optical weight
	 */
	size?: 'small' | 'medium' | 'large';

	/**
	 * Number between 100 (thin) and 700 (bold)
	 */
	weight?: number;
}

const props = withDefaults(defineProps<BaseIconProps>(), {
	size: 'medium',
	weight: 500,
});

const opticalSize = computed(() => {
	switch (props.size) {
		case 'small':
			return 20;
		case 'medium':
		default:
			return 24;
	}
});

const fontSize = computed(() => unref(opticalSize) + 'px');
</script>

<template>
	<span class="base-icon" :class="size">{{ name }}</span>
</template>

<style scoped>
span {
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
	font-variation-settings: 'OPSZ' v-bind(opticalSize), 'WGHT' v-bind(weight);
}
</style>
