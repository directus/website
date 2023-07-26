<script setup lang="ts">
import { BlockProps } from './types';

const { $directus, $readItem } = useNuxtApp();

const props = defineProps<BlockProps>();

const { data: comp } = useAsyncData(() =>
	$directus.request(
		$readItem('block_richtext', props.uuid, {
			fields: ['content'],
		})
	)
);
</script>

<template>
	<BaseText v-if="comp" :content="comp.content" />
</template>
