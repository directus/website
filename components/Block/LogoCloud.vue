<script setup lang="ts">
import type { BlockLogoCloudLogo } from '~/types/schema/blocks';
import type { BlockProps } from './types';

const { $directus, $readItem } = useNuxtApp();

const props = defineProps<BlockProps>();

const { data: block } = useAsyncData(props.uuid, () =>
	$directus.request(
		$readItem('block_logocloud', props.uuid, {
			fields: [
				'type',
				{
					logos: [
						'id',
						'title',
						'external_url',
						{ directus_files_id: ['id', 'description'], resource: ['type', 'slug'], page: ['permalink'] },
					],
				},
			],
		})
	)
);

const logos = computed(() => {
	return (unref(block)?.logos as BlockLogoCloudLogo[]) ?? [];
});
</script>

<template>
	<LogoGrid v-if="block && block.type === 'grid'" :logos="logos" />
	<LogoTicker v-else-if="block && block.type === 'ticker'" :logos="logos" />
	<LogoTitle v-else-if="block && block.type === 'title'" :logos="(logos as any)" />
</template>
