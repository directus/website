<script setup lang="ts">
import type { BlockProps } from './types';
import useVisualEditing from '~/composables/useVisualEditing';

const { $directus, $readItem } = useNuxtApp();
const { autoApply, setAttr, isVisualEditingEnabled } = useVisualEditing();

const props = defineProps<BlockProps>();

const { data: block, refresh } = useAsyncData(props.uuid, () =>
	$directus.request(
		$readItem('block_form', props.uuid, {
			fields: [
				'id',
				'alignment',
				'show_labels',
				'inline',
				{ form: ['hubspot_form_id', 'typeform_form_id', 'route_to_meeting_link_on_success'] },
			],
		}),
	),
);

autoApply(`[data-block-id="${props.uuid}"]`, refresh);
</script>

<template>
	<BaseHsForm
		v-if="block && block.form.hubspot_form_id"
		:data-block-id="props.uuid"
		:form-id="block.form.hubspot_form_id"
		:labels="block.show_labels"
		:inline="block.inline"
		:align="block.alignment ?? undefined"
		:route-to-meeting-link-on-success="block.form.route_to_meeting_link_on_success ?? undefined"
		:data-directus="
			isVisualEditingEnabled
				? setAttr({
						collection: 'block_form',
						item: block.id,
						fields: ['alignment', 'show_labels', 'inline', 'form'],
						mode: 'modal',
					})
				: undefined
		"
	/>
	<BaseTypeForm
		v-if="block && block.form.typeform_form_id"
		:data-block-id="props.uuid"
		:form-id="block.form.typeform_form_id"
		:labels="block.show_labels"
		:inline="block.inline"
		:align="block.alignment ?? undefined"
		:data-directus="
			isVisualEditingEnabled
				? setAttr({
						collection: 'block_form',
						item: block.id,
						fields: ['alignment', 'show_labels', 'inline', 'form'],
						mode: 'modal',
					})
				: undefined
		"
	/>
</template>
