<script setup lang="ts">
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
	color?: 'primary' | 'gray';

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
		return 'NuxtLink';
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
</script>

<template>
	<component
		:is="as"
		class="base-badge"
		:class="[
			`badge-${props.color}`,
			`badge-${props.size}`,
			{
				caps: props.caps,
				border: props.border,
			},
		]"
		v-bind="badgeProps"
	>
		<slot>{{ label }}</slot>
	</component>
</template>

<style scoped>
/* Base */
.badge-base {
	display: inline-flex;
	align-items: center;
	text-decoration: none;
	border-radius: var(--rounded-full);
	font-weight: 600;
	font-family: var(--family-display);
}

/* Colors */
.badge-primary {
	background-color: var(--purple-50);
	color: var(--purple-600);
	border-color: var(--purple-300);
}

.badge-gray {
	background-color: var(--gray-50);
	color: var(--gray-600);
	border-color: var(--gray-300);
}

/* Sizes */
.badge-small {
	font-size: var(--text-xs);
	padding: var(--space-05) var(--space-2);
}

.badge-medium {
	font-size: var(--text-sm);
	padding: var(--space-1) var(--space-3);
}

.badge-large {
	font-size: var(--text-md);
	padding: var(--space-2) var(--space-4);
}

/* Props */
.border {
	border-width: 1px;
	border-style: solid;
}

.caps {
	text-transform: uppercase;
}
</style>
