<script setup lang="ts">
import { BlockProps } from './types';

const { $directus, $readItem } = useNuxtApp();

const props = defineProps<BlockProps>();

const { data: block } = useAsyncData(props.uuid, () =>
	$directus.request(
		$readItem('block_logocloud', props.uuid, {
			fields: ['type', { logos: ['id', { directus_files_id: ['id', 'description'] }] }],
		})
	)
);
</script>

<template>
	<div v-if="block" class="block-logocloud-container">
		<div class="block-logocloud">
			<BaseDirectusImage
				v-for="logo in block.logos"
				:key="logo.id"
				:uuid="logo.directus_files_id.id"
				:alt="logo.directus_files_id.description ?? ''"
			/>
		</div>
	</div>
</template>

<style scoped lang="scss">
.block-logocloud-container {
	container-type: inline-size;
	grid-column: narrow !important;
}

.block-logocloud {
	grid-template-columns: repeat(auto-fit, minmax(var(--space-28), 1fr));
	justify-items: center;
	align-items: center;
	gap: var(--space-12);
	display: grid;
}

// For pink color override
// .block-logocloud {
// 	filter: invert(0.5) sepia(0.8) saturate(0.8) hue-rotate(269deg);
// }
</style>
