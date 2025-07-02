<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref } from 'vue';
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
				{
					form: [
						'hubspot_form_id',
						'typeform_form_id',
						'internal_form_url',
						'route_to_meeting_link_on_success',
						'form_config',
					],
				},
			],
		}),
	),
);

const { data: formConfigSlug } = useAsyncData(`form-config-slug-${block.value?.form?.form_config}`, async () => {
	if (block.value?.form?.form_config && typeof block.value.form.form_config === 'string') {
		const config = await $directus.request(
			$readItem('internal_form_config', block.value.form.form_config, {
				fields: ['slug'],
			}),
		);

		return config.slug;
	}

	return null;
});

autoApply(`[data-block-id="${props.uuid}"]`, refresh);

const iframeRef = ref<HTMLIFrameElement | null>(null);

const handleMessage = (event: MessageEvent) => {
	if (!iframeRef.value || !block.value?.form.internal_form_url) return;

	const allowedOrigin = new URL(block.value.form.internal_form_url).origin;

	if (event.origin !== allowedOrigin) return;

	const { type, height, scrollToTop } = event.data || {};

	if (type === 'set-height' && typeof height === 'number') {
		iframeRef.value.style.height = `${height}px`;

		if (scrollToTop) {
			window.scrollTo({ top: 0, behavior: 'smooth' });
		}
	}
};

onMounted(() => {
	if (block.value?.form.internal_form_url) {
		window.addEventListener('message', handleMessage);
	}
});

onBeforeUnmount(() => {
	if (block.value?.form.internal_form_url) {
		window.removeEventListener('message', handleMessage);
	}
});
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
		v-else-if="block && block.form.typeform_form_id"
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

	<div
		v-else-if="block && block.form.internal_form_url"
		class="form"
		:class="[{ 'hide-labels': !block.show_labels, inline: block.inline }, `align-${block.alignment ?? 'center'}`]"
		:data-block-id="props.uuid"
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
	>
		<iframe
			:src="formConfigSlug ? `${block.form.internal_form_url}?config=${formConfigSlug}` : block.form.internal_form_url"
			ref="iframeRef"
			class="w-full border-none"
			scrolling="no"
			frameborder="0"
		/>
	</div>
</template>

<style scoped lang="scss">
.form {
	&.align-left {
		text-align: left;
	}

	&.align-center {
		text-align: center;
	}

	&.inline {
		display: inline-block;
	}

	:deep(iframe) {
		width: 100%;
		max-width: 100%;
		margin: 0 auto;
		transition: var(--duration-150) var(--ease-out);

		&:hover {
			border-color: var(--gray-400);
			transition: none;
		}

		&:focus-within {
			border-color: var(--primary);
			outline: none;
			box-shadow: 0px 0px var(--space-1) 0px var(--primary-100);
		}
	}
}
</style>
