<script setup lang="ts">
import type { BlockProps } from './types';

const { $directus, $readItem } = useNuxtApp();

const props = defineProps<BlockProps>();

const { data: block } = useAsyncData(props.uuid, () =>
	$directus.request(
		$readItem('block_button_group', props.uuid, {
			fields: [
				'size',
				{
					buttons: [
						'id',
						{
							block_button_id: ['external_url', 'page', 'variant', 'label', 'color', 'pulse', 'icon'],
						},
					],
				},
			],
		})
	)
);
</script>

<template>
	<BaseButtonGroup v-if="block" :size="block.size">
		<BaseButton
			v-for="{ block_button_id: button, id } in block.buttons"
			:key="id"
			:href="button.external_url ?? button.page ?? undefined"
			:variant="button.variant"
			:color="button.color"
			:pulse="button.pulse"
			:icon="button.icon ?? undefined"
			:size="block.size"
		>
			{{ button.label }}
		</BaseButton>
	</BaseButtonGroup>
</template>
