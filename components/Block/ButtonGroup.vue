<script setup lang="ts">
import type { BlockProps } from './types';

export interface BlockButtonGroupProps extends BlockProps {
	align?: 'left' | 'center';
}

const { $directus, $readItem } = useNuxtApp();

const props = defineProps<BlockButtonGroupProps>();

const { data: block } = useAsyncData(props.uuid, () =>
	$directus.request(
		$readItem('block_button_group', props.uuid, {
			fields: [
				'alignment',
				{
					buttons: ['id', 'block_button_id'],
				},
			],
		})
	)
);
</script>

<template>
	<BaseButtonGroup v-if="block" :align="align ?? block.alignment ?? undefined">
		<BlockButton v-for="{ block_button_id: button, id } in block.buttons" :key="id" :uuid="button" />
	</BaseButtonGroup>
</template>
