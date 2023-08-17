<script setup lang="ts">
interface BaseButtonGroupProps {
	size?: 'small' | 'medium' | 'large';
	align?: 'left' | 'center';
	containerStyle?: 'default' | 'pill';
}

withDefaults(defineProps<BaseButtonGroupProps>(), {
	size: 'medium',
	align: 'center',
	containerStyle: 'default',
});
</script>

<template>
	<div class="button-group-container">
		<div class="button-group" :class="[`align-${align}`, `style-${containerStyle}`]">
			<slot />
		</div>
	</div>
</template>

<style lang="scss" scoped>
.button-group-container {
	container-type: inline-size;
}

.button-group {
	display: flex;
	flex-wrap: wrap;

	&.align-center {
		margin-inline: auto;
	}

	&.style-default {
		gap: var(--space-4);

		@container (width > 35rem) {
			gap: var(--space-5);
		}
	}

	&.style-pill {
		width: max-content;
		gap: var(--space-1);
		background-color: var(--gray-100);
		padding: var(--space-1);
		border-radius: var(--rounded-full);

		:deep(.base-button:not(.router-link-active)) {
			--color: var(--gray-400);
			--background-color: var(--white);
			--border-color: transparent;

			--color-hover: var(--gray-700);
			--background-color-hover: var(--white);
			--border-color-hover: transparent;
		}

		@container (width > 35rem) {
			gap: var(--space-2);
			padding: var(--space-2);
		}
	}

	:deep(> *) {
		flex-shrink: 0;
	}
}
</style>
