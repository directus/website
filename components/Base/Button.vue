<script setup lang="ts">
export interface BaseButtonProps {
	icon?: string | null;
	size?: 'small' | 'medium' | 'large';
	type?: 'button' | 'submit' | 'reset';
	color?: 'primary' | 'secondary' | 'gray' | 'white' | 'danger';
	label?: string;
	href?: string;
	target?: '_blank' | '_self' | '_parent' | '_top';
	outline?: boolean;
}

const props = withDefaults(defineProps<BaseButtonProps>(), {
	size: 'medium',
	type: 'button',
});

const as = computed(() => {
	if (props.href) {
		return resolveComponent('NuxtLink');
	} else {
		return 'button';
	}
});

const buttonProps = computed(() => {
	if (props.href) {
		return {
			href: props.href,
			target: props.target,
		};
	}

	return {};
});

const isIconOnly = computed(() => {
	return props.icon && !props.label;
});

const iconSize = computed(() => {
	if (props.size === 'small') return 'x-small';
	if (props.size === 'medium') return 'small';
	if (props.size === 'large') return 'small';
	return props.size;
});
</script>

<template>
	<component
		:is="as"
		:class="['base-button', `size-${size}`, `color-${color}`, { 'icon-only': isIconOnly, outline }]"
		v-bind="buttonProps"
	>
		<span v-if="label" class="label">
			{{ label }}
		</span>

		<BaseIcon v-if="icon" class="icon" :name="icon" :size="iconSize" />
	</component>
</template>

<style lang="scss" scoped>
.base-button {
	--background-color: transparent;
	--border-color: transparent;
	--color: var(--gray-200);

	--background-color-hover: var(--background-color);
	--border-color-hover: var(--border-color);
	--color-hover: var(--color);

	background-color: var(--background-color);
	border-color: var(--border-color);
	color: var(--color);
	font-family: var(--family-body);
	text-decoration: none;
	border-radius: var(--rounded-full);
	font-size: var(--font-size-sm);
	line-height: var(--line-height-sm);
	font-weight: 600;
	justify-content: center;
	padding: calc(var(--space-2) - 1px) var(--space-4); /* 1px = offset for border */
	border: 1px solid var(--border-color);
	display: inline-flex;
	align-items: center;
	transition: var(--duration-150) var(--ease-out);
	transition-property: background-color, border-color, color;

	.icon {
		--base-icon-color: currentColor;
	}

	.label + .icon {
		margin-inline-start: var(--space-2);
	}

	&:has(.icon) {
		padding-inline-end: calc(var(--space-4) - var(--space-05));
	}

	&.icon-only {
		padding: calc(var(--space-2) - 1px); /* 1px to appease Ben */
	}

	&:not(.router-link-active):hover {
		background-color: var(--background-color-hover);
		border-color: var(--border-color-hover);
		color: var(--color-hover);
		transition: none;
	}
}

.color-primary {
	--background-color: var(--purple-400);
	--border-color: var(--purple-400);
	--color: var(--white);

	--background-color-hover: var(--purple-500);
	--border-color-hover: var(--purple-500);

	&.outline {
		--color: var(--purple-400);
		--background-color: color-mix(in srgb, transparent, var(--white) 50%);
	}
}

.color-secondary {
	--background-color: var(--black);
	--border-color: var(--black);
	--color: var(--white);

	--background-color-hover: var(--gray-700);
	--border-color-hover: var(--gray-700);

	&.outline {
		--background-color: color-mix(in srgb, transparent, var(--white) 50%);
		--color: var(--black);
		--border-color: var(--gray-200);

		--background-color-hover: color-mix(in srgb, transparent, var(--white) 50%);
		--color-hover: var(--black);
		--border-color-hover: var(--gray-400);
	}
}

.size-small {
	font-size: var(--font-size-xs);
	line-height: var(--line-height-xs);
	padding: calc(var(--space-1) + 1px) var(--space-3); /* 1px to appease Ben */

	&:has(.icon) {
		padding-inline-end: calc(var(--space-3) - var(--space-05));
	}
}

.size-small.icon-only {
	padding: var(--space-3);
}

.size-large {
	font-size: var(--font-size-base);
	line-height: var(--line-height-base);
	padding: calc(var(--space-2) + 1px) var(--space-6); /* 1px to appease Ben */

	&:has(.icon) {
		padding-inline-end: calc(var(--space-6) - var(--space-05));
	}
}

.size-large.icon-only {
	padding: var(--space-3);
}
</style>
