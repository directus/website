<script setup lang="ts">
import type { BlockProps } from './types';

const { $directus, $readItem } = useNuxtApp();

const props = defineProps<BlockProps>();

const { data: block } = useAsyncData(props.uuid, () =>
	$directus.request(
		$readItem('block_resource_slider', props.uuid, {
			fields: [],
		})
	)
);
</script>

<template>
	<div class="block-resource-slider-container">
		<div class="block-resource-slider"></div>
	</div>
</template>
