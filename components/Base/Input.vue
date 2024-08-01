<script setup lang="ts">
import { computed, ref } from 'vue';

interface Props {
	modelValue: string;
	label?: string;
	placeholder?: string;
	type?: string;
	required?: boolean;
	error?: string;
	hideLabel?: boolean;
	prependIcon?: string;
	appendIcon?: string;
}

const props = withDefaults(defineProps<Props>(), {
	type: 'text',
	required: false,
	hideLabel: false,
});

const emit = defineEmits(['update:modelValue', 'clear']);

const inputRef = ref<HTMLInputElement | null>(null);

const updateValue = (event: Event) => {
	const target = event.target as HTMLInputElement;
	emit('update:modelValue', target.value);
};

const clearInput = () => {
	emit('update:modelValue', '');
	emit('clear');
};

const isInvalid = computed(() => !!props.error);

const inputClasses = computed(() => ({
	invalid: isInvalid.value,
	'has-prepend-icon': !!props.prependIcon,
	'has-append-icon': !!props.appendIcon,
}));

const { theme } = useTheme();
</script>

<template>
	<div class="input-container">
		<span v-if="prependIcon" class="prepend-icon-wrapper">
			<BaseIcon :name="prependIcon" class="icon prepend-icon" />
		</span>
		<input
			:id="label"
			ref="inputRef"
			:value="modelValue"
			:type="type"
			:placeholder="placeholder"
			:required="required"
			:class="inputClasses"
			@input="updateValue"
		/>
		<span v-if="appendIcon" class="append-icon-wrapper">
			<BaseIcon :name="appendIcon" class="icon append-icon" />
		</span>
		<!-- <BaseIcon
			v-if="type === 'search' && modelValue"
			name="close"
			class="icon append-icon clear-icon"
			@click="clearInput"
		/> -->
	</div>
</template>

<style scoped lang="scss">
.input-container {
	position: relative;
	display: flex;
	align-items: center;

	.append-icon-wrapper,
	.prepend-icon-wrapper {
		position: absolute;
		inset-block: 0;
		display: flex;
		align-items: center;
		padding: var(--space-2);
	}

	.append-icon-wrapper {
		inset-inline-end: 0px;
	}

	.prepend-icon-wrapper {
		inset-inline-start: 0px;
	}

	input {
		border: 1px solid var(--gray-200);
		border-radius: var(--rounded-lg);
		padding: var(--space-3);
		inline-size: 100%;
		transition: var(--duration-150) var(--ease-out);
		width: 100%;
		height: var(--space-12);

		&::placeholder {
			color: var(--gray-400);
		}

		&.invalid {
			border-color: var(--danger);
		}

		&:hover {
			border-color: var(--gray-400);
			transition: none;
		}

		&:focus {
			border-color: var(--primary);
			outline: none;
			box-shadow: 0px 0px var(--space-1) 0px var(--primary-100);
		}

		&.has-prepend-icon {
			padding-left: var(--space-10);
		}

		&.has-append-icon {
			padding-right: var(--space-10);
		}
	}

	.icon {
		color: var(--gray-400);
		width: var(--space-6);
		height: var(--space-6);
		flex-shrink: 0;
	}

	.prepend-icon {
		left: var(--space-3);
	}

	.append-icon {
		right: var(--space-3);
	}

	.clear-icon {
		cursor: pointer;
		&:hover {
			color: var(--gray-600);
		}
	}
}

.theme-dark {
	.input-container {
		input {
			border: 0;
			background-color: var(--gray-800);
			color: var(--foreground);
			&::placeholder {
				color: var(--gray-500);
			}
		}

		.icon {
			color: var(--gray-500);
		}

		.clear-icon:hover {
			color: var(--gray-300);
		}
	}
}
</style>
