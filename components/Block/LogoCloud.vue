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
}

.block-logocloud {
	--columns: 1;

	display: grid;
	grid-template-columns: repeat(var(--columns), 1fr);
	justify-items: center;
	align-items: center;
	gap: var(--space-12);

	@container (width > 20rem) {
		--columns: 2;
	}

	@container (width > 25rem) {
		--columns: 4;
	}

	@container (width > 40rem) {
		--columns: 6;
	}

	@container (width > 55rem) {
		--columns: 8;
	}
}

// For pink color override
// .block-logocloud {
// 	filter: invert(0.5) sepia(0.8) saturate(0.8) hue-rotate(269deg);
// }
</style>
