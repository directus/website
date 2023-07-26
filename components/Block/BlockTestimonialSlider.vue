<script setup lang="ts">
import { BlockProps } from './types';

const { $directus, $readItem } = useNuxtApp();

const props = defineProps<BlockProps>();

const { data: comp } = useAsyncData(() =>
	$directus.request(
		$readItem('block_testimonial_slider', props.uuid, {
			fields: [
				'id',
				{ items: ['id', 'company_logo', 'company_name', 'person_name', 'person_title', 'person_image', 'quote'] },
			],
		})
	)
);
</script>

<template>
	!
	<div class="testimonial-slider"></div>
</template>
