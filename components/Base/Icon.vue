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
			return '16';
		case 'small':
			return '20';
		case 'medium':
		default:
			return '24';
		case 'large':
			return '48';
	}
});

const troubleIcons = [
	'expand_more',
	'expand_less',
	'arrow_forward',
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
	// If the icon is one of the trouble icons, do not add the suffix '-outline'
	const iconName = prefix + kebabCase + (troubleIcons.includes(props.name) ? '' : '-outline');
	return iconName;
});

const fontSize = computed(() => unref(opticalSize) + 'px');
</script>

<template>
	<span class="base-icon">
		<IconCSS v-if="iconName" :name="iconName" :class="size" />
	</span>
</template>

<style lang="scss" scoped>
.base-icon {
	--base-icon-color: var(--foreground);
	color: var(--base-icon-color);
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
	user-select: none;
}

.x-small {
	height: 16px;
	width: 16px;
}

.small {
	height: 20px;
	width: 20px;
}

.medium {
	height: 24px;
	width: 24px;
}

.large {
	height: 48px;
	width: 48px;
}
</style>
