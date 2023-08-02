<script setup lang="ts">
import { BlockProps } from './types';

const { $directus, $readItem } = useNuxtApp();

const props = defineProps<BlockProps>();

const { data: comp } = useAsyncData(() =>
	$directus.request(
		$readItem('block_testimonial_slider', props.uuid, {
			fields: [
				'id',
				{
					items: ['id', 'comp_quote_id'],
				},
			],
		})
	)
);
</script>

<template>
	<div v-if="comp" class="testimonial-slider">
		<CompQuote v-for="quote in comp.items" :key="quote.id" :uuid="quote.comp_quote_id" />
	</div>
</template>
