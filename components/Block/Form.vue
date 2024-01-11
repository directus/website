<script setup lang="ts">
import type { BlockProps } from './types';

const { $directus, $readItem } = useNuxtApp();

const props = defineProps<BlockProps>();

const { data: block } = useAsyncData(props.uuid, () =>
	$directus.request(
		$readItem('block_form', props.uuid, {
			fields: [
				'alignment',
				'show_labels',
				'inline',
				{ form: ['hubspot_form_id', 'typeform_form_id', 'route_to_meeting_link_on_success'] },
			],
		}),
	),
);
</script>

<template>
	<BaseHsForm
		v-if="block && block.form.hubspot_form_id"
		:form-id="block.form.hubspot_form_id"
		:labels="block.show_labels"
		:inline="block.inline"
		:align="block.alignment ?? undefined"
		:route-to-meeting-link-on-success="block.form.route_to_meeting_link_on_success ?? undefined"
	/>
	<BaseTypeForm
		v-if="block && block.form.typeform_form_id"
		:form-id="block.form.typeform_form_id"
		:labels="block.show_labels"
		:inline="block.inline"
		:align="block.alignment ?? undefined"
	/>
</template>
