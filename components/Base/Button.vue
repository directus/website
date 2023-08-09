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
	if (props.size === 'large') return 'medium';
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

<style scoped>
.base-button {
	font-family: var(--family-body);
	cursor: pointer;
	text-decoration: none;
	border-radius: var(--rounded-full);
	font-size: var(--font-size-sm);
	line-height: var(--line-height-sm);
	font-weight: 600;
	justify-content: center;
	padding: calc(var(--space-2) - 1px) var(--space-4); /* 1px = offset for border */
	border: 1px solid;
	display: inline-flex;
	align-items: center;

	&.icon-only {
		padding: var(--space-2);
	}

	.icon {
		--base-icon-color: currentColor;
	}

	.label + .icon {
		margin-inline-start: var(--space-2);
	}

	&:has(.icon) {
		padding-inline-end: calc(var(--space-4) - var(--space-05));
	}
}

.color-primary {
	background-color: var(--purple-400);
	border-color: var(--purple-400);
	color: var(--white);

	&.outline {
		background-color: color-mix(in srgb, transparent, var(--white) 50%);
		color: var(--purple-400);
	}
}

.color-secondary {
	background-color: var(--black);
	border-color: var(--black);
	color: var(--white);

	&.outline {
		background-color: color-mix(in srgb, transparent, var(--white) 50%);
		color: var(--black);
		border-color: var(--gray-200);
	}
}

.size-small {
	font-size: var(--font-size-xs);
	line-height: var(--line-height-xs);
	padding: var(--space-05) var(--space-3);

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
	padding: calc(var(--space-2) + 1px) var(--space-6); /* 1px to please Ben */

	&:has(.icon) {
		padding-inline-end: calc(var(--space-6) - var(--space-05));
	}
}

.size-large.icon-only {
	padding: var(--space-3);
}
</style>
