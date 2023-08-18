<script setup lang="ts">
export interface BaseCardGroup {
	direction?: 'horizontal' | 'vertical';
	grid: '3' | '4' | '6';
}

withDefaults(defineProps<BaseCardGroup>(), {
	direction: 'horizontal',
});
</script>

<template>
	<div :class="[`direction-${direction ?? 'horizontal'}`, 'base-cardgroup', `grid-${grid}`]">
		<slot />
	</div>
</template>

<style lang="scss" scoped>
.base-cardgroup {
	&.direction-horizontal {
		--columns: 1;
		--gap: var(--space-5);

		display: grid;
		grid-template-columns: repeat(var(--columns), 1fr);
		gap: var(--gap);

		&.grid-3 {
			@container (width > 40rem) {
				--columns: 3;
				--gap: var(--space-6);
			}

			@container (width > 60rem) {
				--gap: var(--space-20);
			}
		}

		&.grid-4 {
			@container (width > 20rem) {
				--columns: 2;
			}

			@container (width > 40rem) {
				--columns: 3;
				--gap: var(--space-6);
			}

			@container (width > 60rem) {
				--columns: 4;
				--gap: var(--space-8);
			}
		}

		&.grid-6 {
			@container (width > 20rem) {
				--columns: 3;
			}

			@container (width > 40rem) {
				--gap: var(--space-6);
			}

			@container (width > 60rem) {
				--columns: 6;
				--gap: var(--space-8);
			}
		}
	}

	&.direction-vertical {
		.card + .card {
			margin-block-start: var(--space-5);
		}

		@container (width > 25rem) {
			.card {
				padding-block-end: var(--space-5);
			}

			.card + .card {
				margin-block-start: var(--space-5);
			}

			.card:not(:last-child) {
				border-block-end: 1px solid var(--gray-200);
			}
		}
	}
}
</style>
