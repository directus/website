<script setup lang="ts">
export interface BaseHsFormProps {
	formId: string;
	labels?: boolean;
	inline?: boolean;
}

const props = withDefaults(defineProps<BaseHsFormProps>(), {
	labels: true,
	inline: false,
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
	<div :id="generatedId" class="form" :class="{ 'hide-labels': labels === false, inline }" />
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

	:deep(input),
	:deep(select) {
		border: 1px solid var(--gray-200);
		border-radius: var(--rounded-lg);
		padding: var(--space-3);
		margin-block-start: var(--space-2);
		inline-size: 100%;
		transition: var(--duration-150) var(--ease-out);
		width: 100% !important;

		&.invalid {
			border-color: var(--red-500);
		}

		&:hover {
			border-color: var(--gray-400);
			transition: none;
		}

		&:focus {
			border-color: var(--primary);
			outline: none;
			box-shadow: 0px 0px var(--space-1) 0px var(--purple-100);
		}
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
		background-color: var(--purple-400);
		border: 1px solid var(--purple-400);
		color: var(--white);
		transition: var(--duration-150) var(--ease-out);
		transition-property: background-color, border-color;
		cursor: pointer;
		margin-block-start: var(--space-8);
		min-inline-size: var(--space-32);

		&:hover {
			background-color: var(--purple-500);
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
		color: var(--red-500);
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
		justify-content: center;

		.hs-error-msgs {
			display: none;
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
}
</style>
