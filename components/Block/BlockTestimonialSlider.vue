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
					items: [
						'id',
						{
							comp_quote_id: [
								'id',
								'quote',
								'person_name',
								'person_image',
								'company_name',
								'company_logo',
								{
									button: ['id', 'sort', 'label', 'variant', 'page', 'type', 'resource', 'external_url'],
								},
							],
						},
					],
				},
			],
		})
	)
);
</script>

<template>
	<div class="testimonial-slider"></div>
</template>
