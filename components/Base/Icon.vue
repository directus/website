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
	'all_inclusive',
	'apartment',
	'api',
	'api',
	'arrow_back',
	'arrow_forward',
	'autopay',
	'autostop',
	'avg_pace',
	'cached',
	'check',
	'checklist',
	'checklist_rtl',
	'close',
	'cloudy',
	'code',
	'compare_arrows',
	'cruelty_free',
	'dynamic_feed',
	'electrical_services',
	'emoji_people',
	'expand_less',
	'expand_more',
	'full_stacked_bar_chart',
	'functions',
	'globe_uk',
	'home_app_logo',
	'horizontal_rule',
	'image_search',
	'insights',
	'login',
	'menu_rounded',
	'money_off',
	'monitoring',
	'online_prediction',
	'password',
	'post_add',
	'public',
	'published_with_changes',
	'query_stats',
	'repeat',
	'security',
	'sort_by_alpha',
	'sports_martial_arts',
	'support',
	'sync_alt',
	'timeline',
	'translate',
	'trending_up',
	'update',
	'webhook',
	'work',
	'support_agent',
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
