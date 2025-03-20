<script setup lang="ts">
import type { BlockProps } from './types';

const props = defineProps<BlockProps>();

const { $directus, $readItem } = useNuxtApp();

const { data: block } = useAsyncData(props.uuid, () =>
	$directus.request(
		$readItem('block_card_group', props.uuid, {
			fields: ['stacked', 'icon_color', 'style', 'grid', 'title_size', 'icon_size', { cards: ['block_card_id'] }],
		}),
	));
</script>

<template>
	<BaseCardGroup
		v-if="block"
		:direction="block.stacked ? 'vertical' : 'horizontal'"
		:grid="block.grid"
		:icon-color="block.icon_color"
	>
		<BlockCard
			v-for="{ block_card_id: card } in block.cards"
			:key="card as string"
			class="card"
			:uuid="card as string"
			:direction="block.stacked ? 'horizontal' : 'vertical'"
			:media-style="block.style"
			:title-size="block.title_size"
			:icon-size="block.icon_size"
		/>
	</BaseCardGroup>
</template>
