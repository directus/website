<script setup lang="ts">
import type { BlockProps } from './types';

const props = defineProps<BlockProps>();

const { $directus, $readItem } = useNuxtApp();

const { data: block } = useAsyncData(props.uuid, () =>
	$directus.request(
		$readItem('block_richtext', props.uuid, {
			fields: ['content', 'color'],
		}),
	));
</script>

<template>
	<BaseText v-if="block" :content="block.content" :color="block.color" />
</template>
