<script setup lang="ts">
import type { CompProps } from './types';

const { $directus, $readItem } = useNuxtApp();

const props = defineProps<CompProps>();

const { data: comp } = useAsyncData(props.uuid, () =>
	$directus.request(
		$readItem('comp_button_groups', props.uuid, {
			fields: [
				{
					buttons: ['id', 'external_url', 'page', 'variant', 'label'],
				},
			],
		})
	)
);
</script>

<template>
	<BaseButtonGroup v-if="comp">
		<BaseButton
			v-for="button in comp.buttons"
			:key="button.id"
			:href="button.external_url ?? button.page ?? undefined"
			:variant="button.variant"
		>
			{{ button.label }}
		</BaseButton>
	</BaseButtonGroup>
</template>
