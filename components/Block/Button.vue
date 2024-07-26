<script setup lang="ts">
import type { BlockProps } from './types';

const { $directus, $readItem } = useNuxtApp();

const props = defineProps<BlockProps>();

const { data: block } = await useAsyncData(props.uuid, () =>
	$directus.request(
		$readItem('block_button', props.uuid, {
			fields: [
				'id',
				'external_url',
				'label',
				'color',
				'outline',
				'icon',
				'size',
				{ page: ['permalink'], resource: ['slug', { type: ['slug'] }] },
				'ph_event',
			],
		}),
	),
);

const href = computed(() => {
	const blockData = unref(block);

	if (blockData?.external_url) {
		return blockData.external_url;
	}

	if (blockData?.page?.permalink) {
		return blockData.page.permalink;
	}

	if (blockData?.resource?.slug && blockData?.resource?.type?.slug) {
		return `/${blockData.resource.type.slug}/${blockData.resource.slug}`;
	}

	return undefined;
});
</script>

<template>
	<BaseButton
		v-if="block"
		v-capture="block.ph_event ? { name: block.ph_event, properties: { block } } : ''"
		:href="href"
		:color="block.color"
		:icon="block.icon ?? undefined"
		:size="block.size"
		:label="block.label ?? undefined"
		:outline="block.outline"
	/>
</template>
