<script setup lang="ts">
import { computed } from 'vue';
import BaseIcon from '../base-icon/base-icon.vue';

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
		// router-link is not displaying correctly in Histoire
		return 'a';
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
				]"
				:size="size"
			/>
		</slot>
		<slot>
			<span v-if="label">
				{{ label }}
			</span>
		</slot>

		<slot name="trailing" :disabled="disabled" :loading="loading">
			<BaseIcon v-if="isTrailing && trailingIconName" :name="trailingIconName" aria-hidden="true" :size="size" />
		</slot>
	</component>
</template>

<style scoped>
.btn-base {
	display: inline-flex;
	align-items: center;
	border: none;
	cursor: pointer;
	text-decoration: none;
	border-top-right-radius: 9999px;
	border-bottom-right-radius: 9999px;
	border-top-left-radius: 9999px;
	border-bottom-left-radius: 9999px;
	font-weight: 600;

	&:disabled {
		opacity: 0.8;
		cursor: not-allowed;
	}
}

/* Variant */
.frosted {
	--bg-opacity: 0.5;
	border-width: 1px;
	border-style: solid;
	box-shadow: 0px 30px 60px -30px rgba(0, 0, 0, 0.05), 0px 2px 4px 0px rgba(0, 0, 0, 0.05);
	backdrop-filter: blur(2px);
}

.gradient {
	--bg-opacity: 1;
	background: var(--purple-pink, linear-gradient(168deg, #745eff 0%, #915eff 100%));
	color: var(--white);
}

/* Color */
.btn-primary {
	background-color: rgba(102, 68, 255, var(--bg-opacity));
	color: var(--white);
	border-color: var(--purple-400);
}

.btn-secondary {
	background-color: rgba(255, 153, 221, var(--bg-opacity));
	border-color: rgba(255, 153, 221, var(--bg-opacity));
	color: var(--gray-900);
	&.frosted {
		color: var(--gray-800);
	}
}

.btn-gray {
	background-color: rgba(229, 231, 235, var(--bg-opacity));
	border-color: rgba(229, 231, 235, var(--bg-opacity));
	color: var(--gray-900);
}

.btn-white {
	background-color: rgba(255, 255, 255, var(--bg-opacity));
	border-color: rgba(255, 255, 255, var(--bg-opacity));
	color: var(--primary);
}

.btn-danger {
	background: rgba(221, 63, 83, var(--bg-opacity));
	border-color: rgba(221, 63, 83, var(--bg-opacity));
	color: var(--white);
}

/* Size */
.btn-small {
	font-size: var(--text-md);
	padding: 0.5rem 1rem;
	column-gap: 0.5rem;
	&.icon-only {
		padding: 0.5rem;
	}
}

.btn-medium {
	font-size: var(--text-lg);
	padding: 0.75rem 1.5rem;
	column-gap: 0.75rem;
	&.icon-only {
		padding: 0.75rem;
	}
}

.btn-large {
	font-size: var(--text-2xl);
	padding: 1rem 2rem;
	column-gap: 1rem;
	&.icon-only {
		padding: 1rem;
	}
}

/* Icon */

/* Pulse */
.pulse {
	box-shadow: 0 0 0 8px rgba(102, 68, 255, 0.2);
	animation-name: floating;
	animation-duration: 3s;
	animation-iteration-count: infinite;
	animation-timing-function: cubic-bezier(0.5, 0, 0.5, 1);

	@keyframes floating {
		0% {
			box-shadow: 0 0 0 8px rgba($primary, 0.2);
		}
		50% {
			box-shadow: 0 0 0 6px rgba($primary, 0.3);
		}
		100% {
			box-shadow: 0 0 0 8px rgba($primary, 0.2);
		}
	}
}

/* Loading */
.animate-spin {
	animation: spin 1s linear infinite;

	@keyframes spin {
		from {
			transform: rotate(0deg);
		}
		to {
			transform: rotate(360deg);
		}
	}
}
</style>
