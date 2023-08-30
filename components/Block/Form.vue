<script setup lang="ts">
import type { BlockProps } from './types';

const { $directus, $readItem } = useNuxtApp();

const props = defineProps<BlockProps>();

const { data: block } = useAsyncData(props.uuid, () =>
	$directus.request(
		$readItem('block_form', props.uuid, {
			fields: ['show_labels', 'inline', { form: ['hubspot_form_id'] }],
		})
	)
);
</script>

<template>
	<BaseHsForm
		v-if="block && block.form.hubspot_form_id"
		:form-id="block.form.hubspot_form_id"
		:labels="block.show_labels"
		:inline="block.inline"
	/>
</template>
