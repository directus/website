<script setup lang="ts">
interface Option {
	label: string;
	value: string;
}

interface Props {
	modelValue: string[] | undefined;
	options: Option[];
	name?: string;
}

const props = withDefaults(defineProps<Props>(), {
	name: 'checkbox-group',
	modelValue: () => [],
});

const emit = defineEmits(['update:modelValue']);

const updateValue = (value: string) => {
	const currentValue = props.modelValue || [];
	const index = currentValue.indexOf(value);
	let newValue;

	newValue = index === -1 ? [...currentValue, value] : currentValue.filter((v) => v !== value);

	emit('update:modelValue', newValue);
};

const isChecked = (value: string) => (props.modelValue || []).includes(value);

const { theme } = useTheme();
</script>

<template>
	<div class="checkbox-group" :class="`theme-${theme}`">
		<div v-for="option in options" :key="option.value" class="checkbox-wrapper">
			<input
				:id="`${name}-${option.value}`"
				type="checkbox"
				:name="name"
				:value="option.value"
				:checked="isChecked(option.value)"
				@change="updateValue(option.value)"
			>
			<label :for="`${name}-${option.value}`">{{ option.label }}</label>
		</div>
	</div>
</template>

<style scoped lang="scss">
.checkbox-group {
	display: flex;
	flex-direction: column;
	gap: var(--space-2);

	.checkbox-wrapper {
		display: flex;
		align-items: center;
		font-size: var(--font-size-sm);
		line-height: var(--line-height-sm);

		input[type='checkbox'] {
			appearance: none;
			-webkit-appearance: none;
			-moz-appearance: none;
			width: var(--space-6);
			height: var(--space-6);
			border: 2px solid var(--gray-300);
			border-radius: var(--rounded-sm);
			margin-right: var(--space-3);
			cursor: pointer;
			position: relative;
			transition: var(--duration-150) var(--ease-out);

			&:hover {
				border-color: var(--gray-400);
			}

			&:checked {
				background-color: var(--primary);
				border-color: var(--primary);

				&::after {
					content: '';
					position: absolute;
					left: 6px;
					top: 2px;
					width: 6px;
					height: 12px;
					border: solid white;
					border-width: 0 2px 2px 0;
					transform: rotate(45deg);
				}
			}

			&:focus {
				outline: none;
				box-shadow: 0 0 0 3px var(--primary-100);
			}
		}

		label {
			cursor: pointer;
			user-select: none;
			padding-top: 2px;
			text-transform: capitalize;
		}
	}
}

.theme-dark {
	.checkbox-wrapper {
		input[type='checkbox'] {
			border-color: var(--gray-600);
			background-color: var(--gray-700);

			&:hover {
				border-color: var(--gray-500);
			}

			&:checked {
				background-color: var(--primary);
				border-color: var(--primary);
			}

			&:focus {
				box-shadow: 0 0 0 3px var(--primary-800);
			}
		}

		label {
			color: var(--gray-200);
		}
	}
}
</style>
