<script setup lang="ts">
import type { BlockProps } from './types';

const { $directus, $readItem } = useNuxtApp();

const props = defineProps<BlockProps>();

const { data: block } = useAsyncData(props.uuid, () =>
	$directus.request(
		$readItem('block_card_group', props.uuid, {
			fields: ['stacked', 'style', 'grid', { cards: ['block_card_id'] }],
		})
	)
);
</script>

<template>
	<BaseCardGroup v-if="block" :direction="block.stacked ? 'vertical' : 'horizontal'" :grid="block.grid">
		<BlockCard
			v-for="{ block_card_id: card } in block.cards"
			:key="card"
			class="card"
			:uuid="card"
			:direction="block.stacked ? 'horizontal' : 'vertical'"
			:media-style="block.style"
		/>
	</BaseCardGroup>
</template>
