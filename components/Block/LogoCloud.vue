<script setup lang="ts">
import { BlockProps } from './types';
import type { BlockLogoCloudLogo } from '~/types/schema/blocks';

const { $directus, $readItem } = useNuxtApp();

const props = defineProps<BlockProps>();

const { data: block } = useAsyncData(props.uuid, () =>
	$directus.request(
		$readItem('block_logocloud', props.uuid, {
			fields: ['type', { logos: ['id', { directus_files_id: ['id', 'description'] }] }],
		})
	)
);

const logos = computed(() => {
	return (unref(block)?.logos as BlockLogoCloudLogo[]) ?? [];
});
</script>

<template>
	<BaseLogoGrid v-if="block && block.type === 'grid'" :logos="logos" />
	<BaseLogoTicker v-else-if="block && block.type === 'ticker'" :logos="logos" />
</template>
