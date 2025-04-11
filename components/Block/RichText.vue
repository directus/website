<script setup lang="ts">
import type { BlockProps } from './types';
import useVisualEditing from '~/composables/useVisualEditing';

const { $directus, $readItem } = useNuxtApp();
const { autoApply, setAttr, isVisualEditingEnabled } = useVisualEditing();

const props = defineProps<BlockProps>();

const { data: block, refresh } = useAsyncData(props.uuid, () =>
	$directus.request(
		$readItem('block_richtext', props.uuid, {
			fields: ['id', 'content', 'color'],
		}),
	),
);

autoApply(`[data-block-id="${props.uuid}"]`, refresh);
</script>

<template>
	<BaseText
		v-if="block"
		:data-block-id="props.uuid"
		:content="block.content"
		:color="block.color"
		:data-directus="
			isVisualEditingEnabled
				? setAttr({
						collection: 'block_richtext',
						item: block.id,
						fields: ['content', 'color'],
						mode: 'popover',
					})
				: undefined
		"
	/>
</template>
