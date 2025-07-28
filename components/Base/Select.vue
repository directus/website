<script setup lang="ts">
import {
	SelectContent,
	SelectItem,
	SelectItemIndicator,
	SelectItemText,
	SelectPortal,
	SelectRoot,
	SelectScrollDownButton,
	SelectScrollUpButton,
	SelectTrigger,
	SelectValue,
	SelectViewport,
} from 'radix-vue';

interface SelectOption {
	label: string;
	value: string;
}

interface Props {
	modelValue: string;
	options: SelectOption[];
	placeholder?: string;
	disabled?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
	placeholder: 'Select an option...',
	disabled: false,
});

const emit = defineEmits<{
	'update:modelValue': [value: string];
}>();

// Internal state that updates immediately and syncs with parent
const internalValue = ref(props.modelValue);

// Sync internal value when props change
watch(
	() => props.modelValue,
	(newValue) => {
		internalValue.value = newValue;
	},
	{ immediate: true },
);

const handleValueChange = (value: string) => {
	internalValue.value = value; // Update immediately for UI
	emit('update:modelValue', value); // Notify parent
};
</script>

<template>
	<div class="select-wrapper">
		<SelectRoot :model-value="internalValue" :disabled="disabled" @update:model-value="handleValueChange">
			<SelectTrigger class="select-trigger">
				<SelectValue :placeholder="placeholder" class="select-value" />
				<BaseIcon name="expand_more" class="select-arrow" />
			</SelectTrigger>

			<SelectPortal>
				<SelectContent class="select-content" position="popper" side="bottom" align="start" :side-offset="4">
					<SelectScrollUpButton class="select-scroll-button">
						<BaseIcon name="expand_less" />
					</SelectScrollUpButton>

					<SelectViewport class="select-viewport">
						<SelectItem v-for="option in options" :key="option.value" :value="option.value" class="select-item">
							<SelectItemText>{{ option.label }}</SelectItemText>
							<SelectItemIndicator class="select-indicator">
								<BaseIcon name="check" />
							</SelectItemIndicator>
						</SelectItem>
					</SelectViewport>

					<SelectScrollDownButton class="select-scroll-button">
						<BaseIcon name="expand_more" />
					</SelectScrollDownButton>
				</SelectContent>
			</SelectPortal>
		</SelectRoot>
	</div>
</template>

<style scoped lang="scss">
.select-wrapper {
	position: relative;
	width: 100%;
}

.select-trigger {
	display: flex;
	align-items: center;
	justify-content: space-between;
	border: 1px solid var(--gray-200);
	border-radius: var(--rounded-lg);
	padding: var(--space-3);
	inline-size: 100%;
	width: 100%;
	height: var(--space-12);
	background-color: var(--background);
	font-size: var(--font-size-sm);
	line-height: var(--line-height-sm);
	transition: var(--duration-150) var(--ease-out);
	cursor: pointer;
	box-sizing: border-box;

	&:hover {
		border-color: var(--gray-400);
		transition: none;
	}

	&:focus {
		outline: none;
		border-color: var(--primary);
		box-shadow: 0px 0px var(--space-1) 0px var(--primary-100);
	}

	&[data-disabled] {
		opacity: 0.5;
		cursor: not-allowed;
	}
}

.select-arrow {
	width: var(--space-6);
	height: var(--space-6);
	color: var(--gray-400);
	flex-shrink: 0;
	transition: transform var(--duration-150) var(--ease-out);

	[data-state='open'] & {
		transform: rotate(180deg);
	}
}

.select-value {
	flex: 1;
	text-align: left;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}

:deep(.select-content) {
	background-color: white !important;
	border: 1px solid #e5e7eb !important;
	border-radius: 0.5rem !important;
	box-shadow:
		0 4px 6px -1px rgba(0, 0, 0, 0.1),
		0 2px 4px -1px rgba(0, 0, 0, 0.06) !important;
	overflow: hidden;
	z-index: 1000;
	max-height: 200px;
	width: var(--radix-select-trigger-width);
	max-width: var(--radix-select-trigger-width);
}

:deep(.select-viewport) {
	padding: 0.25rem;
}

:deep(.select-item) {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 0.5rem 0.75rem;
	border-radius: 0.375rem;
	font-size: 0.875rem;
	line-height: 1.25rem;
	cursor: pointer;
	transition: background-color 150ms ease-out;
	color: #111827;

	&:hover,
	&[data-highlighted] {
		background-color: #f9fafb;
	}

	&[data-state='checked'] {
		background-color: #eff6ff;
		color: #6644ff;
	}
}

:deep(.select-indicator) {
	width: 1.25rem;
	height: 1.25rem;
	flex-shrink: 0;
}

:deep(.select-scroll-button) {
	display: flex;
	align-items: center;
	justify-content: center;
	height: 1.5rem;
	background-color: white;
	color: #6b7280;
	cursor: default;
}

.theme-dark {
	.select-trigger {
		border: 0;
		background-color: var(--gray-800);
		color: var(--foreground);
	}

	.select-arrow {
		color: var(--gray-500);
	}

	:deep(.select-content) {
		background-color: #1f2937 !important;
		border-color: #374151 !important;
		box-shadow:
			0 4px 6px -1px rgba(0, 0, 0, 0.3),
			0 2px 4px -1px rgba(0, 0, 0, 0.2) !important;
	}

	:deep(.select-item) {
		color: #f9fafb;

		&:hover,
		&[data-highlighted] {
			background-color: #374151;
		}

		&[data-state='checked'] {
			background-color: #1e3a8a;
			color: #bfdbfe;
		}
	}

	:deep(.select-scroll-button) {
		background-color: #1f2937;
		color: #9ca3af;
	}
}
</style>
