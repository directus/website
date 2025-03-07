<script setup lang="ts">
export interface BaseHsFormProps {
	formId: string;
	labels?: boolean;
	inline?: boolean;
	align?: 'left' | 'center';
	routeToMeetingLinkOnSuccess?: boolean;
	instanceId?: string;
}

const props = withDefaults(defineProps<BaseHsFormProps>(), {
	labels: true,
	inline: false,
	align: 'center',
});

// Nuxt Scripts help prevent the script from being loaded multiple times
const { onLoaded } = useScript({
	src: 'https://js.hsforms.net/forms/embed/v2.js',
});

const { formId } = toRefs(props);

const { $directus, $readSingleton, $posthog } = useNuxtApp();

declare global {
	// eslint-disable-next-line no-var
	var hbspt: any;
}

const { data: globals } = useAsyncData('sales-reps', () =>
	$directus.request($readSingleton('globals', { fields: ['reps'] })),
);

function formSubmitCallback(form: any, data: any) {
	// Track form submission in PH
	$posthog?.capture('marketing.site.forms.hubspot.submit', {
		form_id: formId.value,
		form_data: data,
	});

	// Redirect to meeting link on form submission
	if (props.routeToMeetingLinkOnSuccess) {
		routeToMeetingLinkCallback(form, data);
	}
}

function routeToMeetingLinkCallback(form: any, data: any) {
	const fallbackLink = 'https://directus.io/thanks';
	const reason = data.submissionValues.lets_chat_reason ?? null;
	const country = data.submissionValues.country_region__picklist_ ?? null;
	const state = data.submissionValues.state_region__picklist_ ?? null;

	const redirectReasons = ["I'd like a guided demo of Directus", 'I am interested in Directus Enterprise'];
	const reps = unref(globals)?.reps ?? [];

	function getSalesRepLink(country: string, state = null) {
		for (const rep of reps) {
			if (!rep.countries?.includes(country)) continue;

			if (!state || rep.states?.includes(state)) {
				return rep.link;
			}
		}

		return fallbackLink;
	}

	if (reason && redirectReasons.includes(reason)) {
		const link = getSalesRepLink(country, state);
		window.location.href = link;
	} else {
		window.location.href = fallbackLink;
	}
}

const renderHsForm = () => {
	window.hbspt?.forms.create({
		region: 'na1',
		portalId: '20534155',
		formId: unref(formId),
		target: `#${unref(generatedId)}`,
		onFormSubmitted: formSubmitCallback,
	});
};

const generatedId = computed(() => `hs-form-${unref(formId)}${props.instanceId ? `-${props.instanceId}` : ''}`);

const { theme } = useTheme();

onLoaded(renderHsForm);

// @TODO: Not sure why we had these here. Safe to remove?
// onMounted(renderHsForm);
// onUpdated(renderHsForm);

watch(formId, renderHsForm);
</script>

<template>
	<div
		:id="generatedId"
		class="form"
		:class="[{ 'hide-labels': labels === false, inline }, `align-${align}`, `theme-${theme}`]"
	/>
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

	:deep(fieldset + fieldset .hs-form-field > label),
	:deep(.hs-dependent-field > * + * .hs-form-field > label),
	:deep(.hs_recaptcha) {
		display: block;
		margin-block-start: var(--space-6);
	}

	:deep(input[type='submit']) {
		--background-color: var(--primary);
		--border-color: var(--primary);
		--color: var(--background);
		--background-color-hover: var(--primary-500);
		--border-color-hover: var(--primary-500);

		border-radius: var(--rounded-full);
		inline-size: auto;
		padding: var(--space-2) var(--space-4);
		font-weight: 600;
		background-color: var(--background-color);
		border: 1px solid var(--border-color);
		color: var(--color);
		transition: var(--duration-150) var(--ease-out);
		transition-property: background-color, border-color;
		cursor: pointer;
		margin-block-start: var(--space-8);
		min-inline-size: var(--space-32);

		&:hover {
			background-color: var(--background-color-hover);
			border-color: var(--border-color-hover);
			transition: none;
		}
	}

	:deep(.hs-field-desc) {
		color: var(--gray-400);
		padding: 0;
	}

	:deep(select) {
		appearance: none;
	}

	:deep(.inputs-list) {
		list-style: none;
		padding: 0;
		margin-block-start: var(--space-6);
	}

	:deep(.hs-form-booleancheckbox > label) {
		display: flex;
		align-items: center;

		input {
			height: auto;
			width: auto !important;
			margin: 0;
			margin-right: 0.5rem;
		}
	}

	:deep(.hs-fieldtype-select .input) {
		position: relative;

		&::after {
			content: url('https://api.iconify.design/material-symbols/expand-more.svg');
			position: absolute;
			inset-inline-end: var(--space-2);
			inset-block-start: var(--space-5);
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
		:deep(label &:not.hs-error-msgs) {
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

		.hs-form-field {
			flex-grow: 1;
		}
	}

	&.inline.align-center :deep(form) {
		justify-content: center;
	}
}

.theme-dark {
	:deep(input[type='submit']) {
		--background-color: var(--foreground);
		--border-color: var(--foreground);
		--color: var(--background);
		--background-color-hover: var(--gray-700);
		--border-color-hover: var(--gray-700);
	}

	:deep(input),
	:deep(select),
	:deep(textarea) {
		border: 0;
	}
}
</style>
