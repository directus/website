<script setup lang="ts">
import type { BlockProps } from './types';

const { $directus, $readItem } = useNuxtApp();

const props = defineProps<BlockProps>();

const { data: block } = useAsyncData(props.uuid, () =>
	$directus.request(
		$readItem('block_button', props.uuid, {
			fields: ['id', 'external_url', 'label', 'color', 'outline', 'icon', 'size', { page: ['permalink'] }],
		})
	)
);
</script>

<template>
	<BaseButton
		v-if="block"
		:href="block.external_url ?? block.page?.permalink ?? undefined"
		:color="block.color"
		:icon="block.icon ?? undefined"
		:size="block.size"
		:label="block.label ?? undefined"
		:outline="block.outline"
	/>
</template>
