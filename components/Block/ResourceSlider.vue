<script setup lang="ts">
import type { BlockProps } from './types';

const { $directus, $readItem } = useNuxtApp();

const props = defineProps<BlockProps>();

const { data: block } = useAsyncData(props.uuid, () =>
	$directus.request(
		$readItem('block_resource_slider', props.uuid, {
			fields: [{ resources: ['id', { resources_id: ['title', { author: ['name'] }] }] }],
		})
	)
);
</script>

<template>
	<div v-if="block" class="block-resource-slider">
		{{ block }}
	</div>
</template>
