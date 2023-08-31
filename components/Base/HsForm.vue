<script setup lang="ts">
export interface BaseHsFormProps {
	formId: string;
	labels?: boolean;
	inline?: boolean;
	align?: 'left' | 'center';
}

const props = withDefaults(defineProps<BaseHsFormProps>(), {
	labels: true,
	inline: false,
	align: 'center',
});

const { formId } = toRefs(props);

useHead({
	script: [
		{
			src: '//js.hsforms.net/forms/embed/v2.js',
			defer: true,
		},
	],
});

const generatedId = computed(() => `hs-form-${unref(formId)}`);

declare global {
	var hbspt: any;
}

const renderHsForm = () => {
	window.hbspt?.forms.create({
		region: 'na1',
		portalId: '20534155',
		formId: unref(formId),
		target: `#${unref(generatedId)}`,
	});
};

onMounted(renderHsForm);
onUpdated(renderHsForm);
watch(formId, renderHsForm);
</script>

<template>
	<div :id="generatedId" class="form" :class="[{ 'hide-labels': labels === false, inline }, `align-${align}`]" />
</template>

<style scoped lang="scss">
.form {
	:deep(*) {
		font-size: var(--font-size-sm);
		line-height: var(--line-height-sm);
	}

	:deep(label) {
		font-weight: 600;
	}

	:deep(.input) {
		margin-right: 0 !important;
	}

	:deep(.hs-form-required) {
		color: var(--primary);
	}

	:deep(input),
	:deep(select),
	:deep(textarea) {
		border: 1px solid var(--gray-200);
		border-radius: var(--rounded-lg);
		padding: var(--space-3);
		margin-block-start: var(--space-2);
		inline-size: 100%;
		transition: var(--duration-150) var(--ease-out);
		width: 100% !important;

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
	}

	:deep(input),
	:deep(select) {
		height: var(--space-12);
	}

	:deep(fieldset) {
		max-width: none;

		&.form-columns-2 {
			display: flex;
			gap: var(--space-4);

			.input {
				margin-right: 0;
			}
		}
	}

	:deep(fieldset + fieldset) {
		margin-block-start: var(--space-7);
	}

	:deep(input[type='submit']) {
		border-radius: var(--rounded-full);
		inline-size: auto;
		padding: var(--space-2) var(--space-4);
		font-weight: 600;
		background-color: var(--primary);
		border: 1px solid var(--primary);
		color: var(--background);
		transition: var(--duration-150) var(--ease-out);
		transition-property: background-color, border-color;
		cursor: pointer;
		margin-block-start: var(--space-8);
		min-inline-size: var(--space-32);

		&:hover {
			background-color: var(--primary-500);
			transition: none;
		}
	}

	:deep(select) {
		appearance: none;
	}

	:deep(.hs-fieldtype-select .input) {
		position: relative;

		&::after {
			content: 'expand_more';
			position: absolute;
			inset-inline-end: var(--space-2);
			inset-block-start: var(--space-5);
			font-family: 'Material Symbols Outlined';
			font-weight: normal;
			font-style: normal;
			font-size: 24px;
			line-height: 1;
			letter-spacing: normal;
			text-transform: none;
			display: inline-block;
			white-space: nowrap;
			word-wrap: normal;
			direction: ltr;
			-webkit-font-feature-settings: 'liga';
			-webkit-font-smoothing: antialiased;
			user-select: none;
			pointer-events: none;
			color: var(--gray-500);
		}
	}

	:deep(.hs-error-msgs) {
		margin: 0;
		padding: 0;
		list-style: none;
		color: var(--danger);
		font-style: italic;
		margin-block-start: var(--space-1);

		li label {
			font-weight: 500;
			font-size: var(--font-size-xs);
			line-height: var(--line-height-xs);
		}
	}

	&.hide-labels {
		:deep(label) {
			display: none !important;
		}
	}

	&.inline :deep(form) {
		display: flex;
		align-items: stretch;
		gap: var(--space-4);

		.hs-error-msgs {
			display: none;
		}

		.actions {
			height: 100%;
		}

		input {
			margin: 0;
		}

		input:not([type='submit']) {
			min-inline-size: var(--space-64);
		}

		input[type='submit'] {
			height: 100%;
		}
	}

	&.inline.align-center {
		justify-content: center;
	}
}
</style>
