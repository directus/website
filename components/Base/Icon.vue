<script setup lang="ts">
import 'iconify-icon';

export interface BaseIconProps {
	/**
	 * Name of the Material Symbol to use.
	 * @see https://icones.js.org/collection/material-symbols for all available icons
	 */
	name: string;

	/**
	 * Size of the icon. Controls font size and dimensions.
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

const filledIcons = [
	'expand_more',
	'expand_less',
	'arrow_forward',
	'arrow_back',
	'security',
	'api',
	'avg_pace',
	'support',
	'check',
	'apartment',
	'autopay',
	'cloudy',
	'close',
	'cruelty_free',
	'horizontal_rule',
	'menu_rounded',
	'translate',
];

const iconName = computed(() => {
	if (!props.name) return;
	// Convert the icon coming from the API to the name of the icon component
	// Directus uses Google Material Icons and the icon values are snake_case (e.g. "account_circle")
	const prefix = 'material-symbols:';
	// Change snake case to kebab case
	const kebabCase = props.name.replace(/_/g, '-');
	// If the icon is one of the filled icons, do not add the suffix '-outline'. Needed because of descrepancies between the Google Material Font we use in Directus icon interface and the Iconify library.
	const iconName = prefix + kebabCase + (filledIcons.includes(props.name) ? '' : '-outline');
	return iconName;
});
</script>

<template>
	<span class="base-icon" :class="size">
		<iconify-icon :icon="iconName"></iconify-icon>
	</span>
</template>

<style lang="scss" scoped>
.base-icon {
	--base-icon-color: var(--foreground);
	color: var(--base-icon-color);
	display: inline-block;
}

.x-small {
	height: 16px;
	width: 16px;
	font-size: 16px;
}

.small {
	height: 20px;
	width: 20px;
	font-size: 20px;
}

.medium {
	height: 24px;
	width: 24px;
	font-size: 24px;
}

.large {
	height: 48px;
	width: 48px;
	font-size: 48px;
}
</style>
