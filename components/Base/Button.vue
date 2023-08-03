<script setup lang="ts">
export interface BaseButtonProps {
	/**
	 * Name of the Material Symbol to use.
	 * @see https://fonts.google.com/icons for all available icons
	 */
	icon?: string;

	/**
	 * Leading icon name. Overrides `icon` if both are provided.
	 */
	leadingIcon?: string;

	/**
	 * Trailing icon name. Overrides `icon` if both are provided.
	 */
	trailingIcon?: string;

	/**
	 * Whether the icon should be placed before the label.
	 */
	leading?: boolean;

	/**
	 * Whether the icon should be placed after the label.
	 */
	trailing?: boolean;

	/**
	 * Size of the button. Controls both font size and icon size.
	 * @values small, medium, large
	 */
	size?: 'small' | 'medium' | 'large';

	/**
	 * Type of the button.
	 * @values button, submit, reset
	 */
	type?: 'button' | 'submit' | 'reset';

	/**
	 * Color of the button.
	 * @values primary, secondary, gray, white, danger
	 */
	color?: 'primary' | 'secondary' | 'gray' | 'white' | 'danger';

	/**
	 * Variant of the button.
	 * @values solid, frosted, gradient
	 */
	variant?: 'solid' | 'frosted' | 'gradient';

	/**
	 * Label of the button.
	 */
	label?: string;

	/**
	 * URL to navigate to when the button is clicked.
	 */
	href?: string;

	/**
	 * Target of the link.
	 * @values _blank, _self, _parent, _top
	 */
	target?: '_blank' | '_self' | '_parent' | '_top';

	/**
	 * Whether the button is in a loading state.
	 */
	loading?: boolean;

	/**
	 * Whether the button is disabled.
	 */
	disabled?: boolean;

	/**
	 * Whether the button should pulse.
	 */
	pulse?: boolean;

	/**
	 * Aria label for the button.
	 */
	ariaLabel?: string;
}

const props = withDefaults(defineProps<BaseButtonProps>(), {
	size: 'medium',
	type: 'button',
	loading: false,
	disabled: false,
	pulse: false,
});

const loadingIcon = 'sync';

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
	} else {
		return { disabled: props.disabled || props.loading, type: props.type };
	}
});

const isLeading = computed(() => {
	return (
		(props.icon && props.leading) ||
		(props.icon && !props.trailing) ||
		(props.loading && !props.trailing) ||
		props.leadingIcon
	);
});

const isTrailing = computed(() => {
	return (props.icon && props.trailing) || (props.loading && props.trailing) || props.trailingIcon;
});

const isIconOnly = computed(() => {
	return props.icon && !props.label;
});

const leadingIconName = computed(() => {
	if (props.loading) {
		return loadingIcon;
	}

	return props.leadingIcon || props.icon;
});

const trailingIconName = computed(() => {
	if (props.loading && !isLeading.value) {
		return loadingIcon;
	}

	return props.trailingIcon || props.icon;
});
</script>

<template>
	<component
		:is="as"
		:aria-label="ariaLabel"
		:class="[
			'btn-base',
			`btn-${props.size}`,
			`btn-${props.color}`,
			props.variant,
			{ pulse: props.pulse },
			{ 'icon-only': isIconOnly },
		]"
		v-bind="buttonProps"
	>
		<slot name="leading" :disabled="disabled" :loading="loading">
			<BaseIcon
				v-if="isLeading && leadingIconName"
				:name="leadingIconName"
				aria-hidden="true"
				:class="[
					{
						'animate-spin': props.loading,
					},
					'hover-move',
				]"
				:size="size"
			/>
		</slot>
		<slot>
			<span v-if="label" class="label">
				{{ label }}
			</span>
		</slot>

		<slot name="trailing" :disabled="disabled" :loading="loading">
			<BaseIcon
				v-if="isTrailing && trailingIconName"
				class="trailing-icon"
				:name="trailingIconName"
				aria-hidden="true"
				:size="size"
			/>
		</slot>
	</component>
</template>

<style scoped>
.btn-base {
	font-family: var(--family-body);
	display: inline-flex;
	align-items: center;
	border: none;
	cursor: pointer;
	text-decoration: none;
	border-radius: var(--rounded-full);
	font-weight: 600;
	justify-content: center;
}

.btn-base:disabled {
	opacity: 0.8;
	cursor: not-allowed;
}

.trailing-icon {
	transition: transform var(--duration-200) var(--ease-in-out);
}

.btn-base:hover .trailing-icon {
	transform: translateX(var(--space-1));
}

.frosted {
	--bg-opacity: 50%;

	border-width: 1px;
	border-style: solid;
	box-shadow: var(--shadow-base);
	backdrop-filter: blur(2px);
}

.gradient {
	--bg-opacity: 100%;

	background: var(--purple-pink, linear-gradient(168deg, var(--purple-400) 0%, var(--purple-300) 100%));
	color: var(--white);
}

.btn-primary {
	background-color: color-mix(in srgb, transparent, var(--purple-400) var(--bg-opacity));
	color: var(--white);
	border-color: var(--purple-400);
}

.btn-secondary {
	background-color: color-mix(in srgb, transparent, var(--pink-200) var(--bg-opacity));
	border-color: color-mix(in srgb, transparent, var(--pink-200) var(--bg-opacity));
	color: var(--gray-900);
}

.btn-secondary.frosted {
	color: var(--gray-800);
}

.btn-gray {
	background-color: color-mix(in srgb, transparent, var(--gray-200) var(--bg-opacity));
	border-color: color-mix(in srgb, transparent, var(--gray-200) var(--bg-opacity));
	color: var(--gray-900);
}

.btn-white {
	background-color: color-mix(in srgb, transparent, var(--white) var(--bg-opacity));
	border-color: color-mix(in srgb, transparent, var(--white) var(--bg-opacity));
	color: var(--primary);
}

.btn-danger {
	background: color-mix(in srgb, transparent, var(--red-500) var(--bg-opacity));
	border-color: color-mix(in srgb, transparent, var(--red-500) var(--bg-opacity));
	color: var(--white);
}

.btn-small {
	font-size: var(--font-size-sm);
	line-height: var(--line-height-sm);
	padding: var(--space-2) var(--space-4);
	column-gap: var(--space-2);
}

.btn-small.icon-only {
	padding: var(--space-2);
}

.btn-medium {
	font-size: var(--font-size-base);
	line-height: var(--line-height-base);
	padding: var(--space-3) var(--space-6);
	column-gap: var(--space-3);
}

.btn-medium.icon-only {
	padding: var(--space-3);
}

.btn-large {
	font-size: var(--font-size-lg);
	line-height: var(--line-height-lg);
	padding: var(--space-4) var(--space-8);
	column-gap: var(--space-4);
}

.btn-large.icon-only {
	padding: var(--space-4);
}

.pulse {
	box-shadow: 0 0 0 var(--space-2) color-mix(in srgb, transparent, var(--purple-400) 20%);

	animation-name: pulsing;
	animation-duration: 3s;
	animation-iteration-count: infinite;
	animation-timing-function: var(--ease-in-out);
}

/** Can't use CSS variables inside of keyframes as they can't interpolate in animation */
@keyframes pulsing {
	0% {
		box-shadow: 0 0 0 8px rgba(102, 68, 255, 0.2);
	}

	50% {
		box-shadow: 0 0 0 6px rgba(102, 68, 255, 0.3);
	}

	100% {
		box-shadow: 0 0 0 8px rgba(102, 68, 255, 0.2);
	}
}

.animate-spin {
	animation: spin var(--duration-1000) var(--ease-linear) infinite;
}

@keyframes spin {
	from {
		transform: rotate(0deg);
	}

	to {
		transform: rotate(360deg);
	}
}
</style>
