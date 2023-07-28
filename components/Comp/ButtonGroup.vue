<script setup lang="ts">
import type { CompProps } from './types';

const { $directus, $readItem } = useNuxtApp();

const props = defineProps<CompProps>();

const { data: comp } = useAsyncData(props.uuid, () =>
	$directus.request(
		$readItem('comp_button_groups', props.uuid, {
			fields: [
				'size',
				{
					buttons: ['id', 'external_url', 'page', 'variant', 'label', 'color', 'pulse', 'icon'],
				},
			],
		})
	)
);
</script>

<template>
	<BaseButtonGroup v-if="comp" :size="comp.size">
		<BaseButton
			v-for="button in comp.buttons"
			:key="button.id"
			:href="button.external_url ?? button.page ?? undefined"
			:variant="button.variant"
			:color="button.color"
			:pulse="button.pulse"
			:icon="button.icon ?? undefined"
			:size="comp.size"
		>
			{{ button.label }}
		</BaseButton>
	</BaseButtonGroup>
</template>
