<script setup lang="ts">
import type { BlockProps } from './types';

const { $directus, $readItem } = useNuxtApp();

const props = defineProps<BlockProps>();

const { data: block } = useAsyncData(props.uuid, () =>
	$directus.request(
		$readItem('block_card_group', props.uuid, {
			fields: ['direction', 'style', 'grid', { cards: ['block_card_id'] }],
		})
	)
);
</script>

<template>
	<div v-if="block" :class="[`direction-${block.direction ?? 'horizontal'}`, 'block-cardgroup', `grid-${block.grid}`]">
		<BlockCard
			v-for="{ block_card_id: card } in block.cards"
			:key="card"
			class="card"
			:uuid="card"
			:direction="block.direction === 'vertical' ? 'horizontal' : 'vertical'"
			:media-style="block.style"
		/>
	</div>
</template>

<style lang="scss" scoped>
.block-cardgroup {
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
