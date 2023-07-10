<script setup lang="ts">
import { computed } from 'vue';
import { classNames } from '../utils/class-names';

export interface BaseBadgeProps {
	/**
	 * Size of the badge. Controls both font size and icon size.
	 * @values small, medium, large
	 */
	size?: 'small' | 'medium' | 'large';

	/**
	 * Color of the badge.
	 * @values primary, white, danger
	 */
	// TODO: What colors are we allowing for badges?
	color?: 'primary';

	/**
	 * Whether the badge should be displayed in all caps.
	 */
	caps?: boolean;

	/**
	 * Whether the badge should have a border.
	 */
	border?: boolean;

	/**
	 * Label of the badge.
	 */
	label?: string;

	/**
	 * URL to navigate to when the badge is clicked.
	 */
	href?: string;

	/**
	 * Target of the link.
	 * @values _blank, _self, _parent, _top
	 */
	target?: '_blank' | '_self' | '_parent' | '_top';

	/**
	 * Aria label for the badge if using as a link.
	 */
	ariaLabel?: string;
}

const props = withDefaults(defineProps<BaseBadgeProps>(), {
	size: 'medium',
	color: 'primary',
});

const as = computed(() => {
	if (props.href) {
		// router-link is not displaying correctly in Histoire
		return 'a';
	} else {
		return 'span';
	}
});

const badgeProps = computed(() => {
	if (props.href) {
		return {
			href: props.href,
			target: props.target,
			...(props.ariaLabel && { 'aria-label': props.ariaLabel }),
		};
	} else {
		return {};
	}
});

const badgeClass = computed(() => {
	return classNames(
		'badge-base',
		`badge-${props.color}`,
		`badge-${props.size}`,
		props.caps && 'caps',
		props.border && 'border'
	);
});
</script>

<template>
	<component :is="as" :class="badgeClass" v-bind="badgeProps">
		<slot>{{ label }}</slot>
	</component>
</template>

<style scoped>
/* Base */
.badge-base {
	display: inline-flex;
	align-items: center;
	text-decoration: none;
	border-top-right-radius: 9999px;
	border-bottom-right-radius: 9999px;
	border-top-left-radius: 9999px;
	border-bottom-left-radius: 9999px;
	font-weight: 600;
	font-family: var(--family-display);
}

/* Colors */
.badge-primary {
	background-color: var(--purple-50);
	color: var(--purple-600);
}

/* Sizes */
.badge-small {
	font-size: 12px;
	padding: 2px 8px;
}

.badge-medium {
	font-size: 14px;
	padding: 4px 12px;
}

.badge-large {
	font-size: 16px;
	padding: 6px 16px;
}

/* Props */
.border {
	border: 1px solid var(--purple-200);
}

.caps {
	text-transform: uppercase;
}
</style>
