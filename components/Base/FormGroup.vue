<script setup lang="ts">
interface Props {
	label?: string;
	required?: boolean;
	error?: string;
	hideLabel?: boolean;
}

withDefaults(defineProps<Props>(), {
	required: false,
	hideLabel: false,
});

const { theme } = useTheme();
</script>

<template>
	<div class="form-group" :class="`theme-${theme}`">
		<label v-if="label && !hideLabel" :for="label">
			{{ label }}
			<span v-if="required" class="required">*</span>
		</label>
		<slot />
		<ul v-if="error" class="error-messages">
			<li>
				<label>{{ error }}</label>
			</li>
		</ul>
	</div>
</template>

<style scoped lang="scss">
.form-group {
	font-size: var(--font-size-sm);
	line-height: var(--line-height-sm);

	label {
		font-weight: 600;
		display: block;
		margin-bottom: var(--space-2);
		text-transform: capitalize;
	}

	.required {
		color: var(--primary);
	}

	.error-messages {
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
}

.theme-dark {
	.error-messages {
		color: var(--danger);
	}
}
</style>
