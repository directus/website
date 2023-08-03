<script setup lang="ts">
import type { BlockProps } from './types';

const { $directus, $readItem } = useNuxtApp();

const props = defineProps<BlockProps>();

const { data: block } = useAsyncData(props.uuid, () =>
	$directus.request(
		$readItem('block_card_group', props.uuid, {
			fields: ['direction', 'aspect_ratio', { cards: ['block_card_id'] }],
		})
	)
);
</script>

<template>
	<div class="block-cardgroup-container">
		<div v-if="block" :class="[`direction-${block.direction ?? 'horizontal'}`, 'block-cardgroup']">
			<BlockCard v-for="{ block_card_id: card } in block.cards" :key="card" :uuid="card" />
		</div>
	</div>
</template>

<style lang="scss" scoped>
.block-cardgroup-container {
	container-type: inline-size;
}

.block-cardgroup {
	--columns: 1;
	--gap: var(--space-5);

	display: grid;
	grid-template-columns: repeat(var(--columns), 1fr);
	gap: var(--gap);

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
</style>
