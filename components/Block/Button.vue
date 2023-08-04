<script setup lang="ts">
import type { BlockProps } from './types';

const { $directus, $readItem } = useNuxtApp();

const props = defineProps<BlockProps>();

const { data: block } = useAsyncData(props.uuid, () =>
	$directus.request(
		$readItem('block_button', props.uuid, {
			fields: ['id', 'external_url', 'variant', 'label', 'color', 'pulse', 'icon', 'size', { page: ['permalink'] }],
		})
	)
);
</script>

<template>
	<BaseButton
		v-if="block"
		:href="block.external_url ?? block.page?.permalink ?? undefined"
		:variant="block.variant"
		:color="block.color"
		:pulse="block.pulse"
		:icon="block.icon ?? undefined"
		:size="block.size ?? undefined"
	>
		{{ block.label }}
	</BaseButton>
</template>
