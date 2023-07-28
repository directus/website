<script setup lang="ts">
import type { BlockProps } from './types';

const { $directus, $readItem } = useNuxtApp();

const props = defineProps<BlockProps>();

const { data: comp } = useAsyncData(props.uuid, () =>
	$directus.request(
		$readItem('block_floating_page', props.uuid, {
			fields: [
				'id',
				'content',
				{ button: ['external_url', 'page', 'variant', 'label'] },
				{ heading: ['preheading', 'heading', 'subheading'] },
			],
		})
	)
);
</script>

<template>
	<div class="floating-page"></div>
</template>
