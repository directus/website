<script setup lang="ts">
export interface BaseBadgeProps {
	color?: 'primary' | 'gray';

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
	color: 'primary',
});

const as = computed(() => {
	if (props.href) {
		return resolveComponent('NuxtLink');
	} else {
		return 'div';
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
	<component :is="as" class="base-badge" :class="[`badge-${color}`]" v-bind="badgeProps">
		<slot>{{ label }}</slot>
	</component>
</template>

<style lang="scss" scoped>
/* Base */
.base-badge {
	display: flex;
	width: max-content;
	align-items: center;
	text-decoration: none;
	border-radius: var(--rounded-full);
	font-weight: 600;
	font-family: var(--family-display);
	text-transform: uppercase;
	font-size: var(--font-size-xs);
	line-height: var(--line-height-xs);
	padding: var(--space-1) var(--space-2);
}

/* Colors */
.badge-primary {
	background-color: color-mix(in srgb, transparent, var(--primary) 10%);
	color: var(--primary);
}

.badge-gray {
	background-color: var(--gray-50);
	color: var(--gray-600);
}
</style>
