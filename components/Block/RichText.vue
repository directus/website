<script setup lang="ts">
import type { BlockProps } from './types';

const { $directus, $readItem } = useNuxtApp();

const props = defineProps<BlockProps>();

const { data: block } = useAsyncData(props.uuid, () =>
	$directus.request(
		$readItem('block_richtext', props.uuid, {
			fields: ['content'],
		})
	)
);
</script>

<template>
	<BaseText v-if="block" :content="block.content" />
</template>
