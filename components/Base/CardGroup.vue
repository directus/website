<script setup lang="ts">
export interface BaseCardGroup {
	direction?: 'horizontal' | 'vertical';
	grid: '3' | '4' | '6';
	iconColor?: 'foreground' | 'white-black' | 'primary';
}

withDefaults(defineProps<BaseCardGroup>(), {
	direction: 'horizontal',
	iconColor: 'foreground',
});
</script>

<template>
	<div class="base-cardgroup" :class="[`direction-${direction ?? 'horizontal'}`, `grid-${grid}`, `icon-color-${iconColor}`]">
		<slot />
	</div>
</template>

<style lang="scss" scoped>
.base-cardgroup {
	&.direction-horizontal {
		--columns: 1;
		--gap: var(--space-6);

		display: grid;
		grid-template-columns: repeat(var(--columns), 1fr);
		gap: var(--gap);
		align-items: flex-start;

		&.icon-color-foreground :deep(.base-card) {
			--icon-color: var(--foreground);
			--icon-background-color: var(--gray-100);
		}

		&.icon-color-white-black :deep(.base-card) {
			--icon-color: var(--foreground);
			--icon-background-color: var(--background);
		}

		&.icon-color-primary :deep(.base-card) {
			--icon-color: var(--primary);
			--icon-background-color: var(--primary-50);
		}

		&.grid-3 {
			@container (width > 40rem) {
				--columns: 3;
				--gap: var(--space-6);
			}

			@container (width > 60rem) {
				--gap: var(--space-12);
			}
		}

		&.grid-4 {
			@container (width > 20rem) {
				--columns: 2;
			}

			@container (width > 40rem) {
				--columns: 4;
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
		--columns: 1;

		display: grid;
		grid-template-columns: repeat(var(--columns), 1fr);
		gap: var(--space-10) var(--space-8);

		@container (width > 60rem) {
			--columns: 2;
		}
	}
}
</style>
