<script setup lang="ts">
import { computed } from 'vue';
import BaseIcon from '../base-icon/base-icon.vue';

function classNames(...classes: any[string]) {
	return classes.filter(Boolean).join(' ');
}

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
	 * @values primary, white, danger
	 */
	color?: 'primary' | 'white' | 'danger';

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

const buttonClass = computed(() => {
	return classNames(
		'btn-base primary',
		`btn-${props.size}`,
		`btn-${props.color}`,
		props.variant,
		props.pulse && 'pulse'
	);
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

const leadingIconName = computed(() => {
	if (props.loading) {
		return loadingIcon;
	}

	return props.leadingIcon || props.icon;
});

const leadingIconClass = computed(() => {
	return classNames(props.loading && 'animate-spin');
});

const trailingIconName = computed(() => {
	if (props.loading && !isLeading.value) {
		return loadingIcon;
	}

	return props.trailingIcon || props.icon;
});
</script>

<template>
	<component :is="as" :aria-label="ariaLabel" :class="buttonClass" v-bind="buttonProps">
		<slot name="leading" :disabled="disabled" :loading="loading">
			<BaseIcon
				v-if="isLeading && leadingIconName"
				:name="leadingIconName"
				aria-hidden="true"
				:class="leadingIconClass"
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

	&:disabled {
		opacity: 0.8;
		cursor: not-allowed;
	}
}

/* Variant */
.frosted {
	border: 1px solid rgba(255, 255, 255, 0.5);
	box-shadow: 0px 30px 60px -30px rgba(0, 0, 0, 0.05), 0px 2px 4px 0px rgba(0, 0, 0, 0.05);
	backdrop-filter: blur(2px);
}

/* Color */
.btn-primary {
	background-color: var(--primary);
	color: var(--white);
}

.btn-secondary {
	background: var(--secondary);
	color: var(--white);
}

.btn-white {
	background: var(--white);
	color: var(--primary);
}

.btn-danger {
	background: var(--red-600);
	color: var(--white);
}

.btn-success {
	background: var(--green-600);
	color: var(--white);
}
/* Size */
.btn-small {
	font-size: var(--text-md);
	padding: 0.5rem 1rem;
	column-gap: 0.5rem;
}

.btn-medium {
	font-size: var(--text-lg);
	padding: 0.75rem 1.5rem;
	column-gap: 0.75rem;
}

.btn-large {
	font-size: var(--text-2xl);
	padding: 1rem 2rem;
	column-gap: 1rem;
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
