<script setup lang="ts">
import type { BlockProps } from './types';
import useVisualEditing from '~/composables/useVisualEditing';

const { $directus, $readItem } = useNuxtApp();
const { autoApply, setAttr, isVisualEditingEnabled } = useVisualEditing();

const props = defineProps<BlockProps>();

const { data: block, refresh } = useAsyncData(props.uuid, () =>
	$directus.request(
		$readItem('block_card_group', props.uuid, {
			fields: ['id', 'stacked', 'icon_color', 'style', 'grid', 'title_size', 'icon_size', { cards: ['block_card_id'] }],
		}),
	),
);

autoApply(`[data-block-id="${props.uuid}"]`, refresh);
</script>

<template>
	<BaseCardGroup
		v-if="block"
		:direction="block.stacked ? 'vertical' : 'horizontal'"
		:grid="block.grid"
		:icon-color="block.icon_color"
		:data-block-id="props.uuid"
		:data-directus="
			isVisualEditingEnabled
				? setAttr({
						collection: 'block_card_group',
						item: block.id,
						fields: ['stacked', 'icon_color', 'style', 'grid', 'title_size', 'icon_size', 'cards'],
						mode: 'modal',
					})
				: undefined
		"
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
