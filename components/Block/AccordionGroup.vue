<script setup lang="ts">
import type { BlockProps } from './types';

const { $directus, $readItem } = useNuxtApp();

const props = defineProps<BlockProps>();

const { data: block } = useAsyncData(props.uuid, () =>
	$directus.request(
		$readItem('block_accordion_group', props.uuid, {
			fields: [{ items: ['id', 'block_accordion_id'] }],
		}),
	),
);
</script>

<template>
	<template v-if="block">
		<BlockAccordion v-for="item in block.items" :key="item.id" :uuid="item.block_accordion_id" />
	</template>
</template>
