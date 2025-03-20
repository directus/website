<script setup lang="ts">
import type { File } from '~/types/schema';
import type { BlockLogoCloudLogo } from '~/types/schema/blocks';

const props = defineProps<{
	logos: BlockLogoCloudLogo[];
}>();
</script>

<template>
	<div class="block-logocloud-grid">
		<BaseDirectusImage
			v-for="logo in props.logos"
			:key="logo.id"
			:uuid="(logo.directus_files_id as File).id"
			:alt="(logo.directus_files_id as File).description ?? ''"
		/>
	</div>
</template>

<style scoped lang="scss">
.block-logocloud-grid {
	--columns: 1;
	display: grid;
	grid-template-columns: repeat(var(--columns), 1fr);
	justify-items: center;
	align-items: center;
	gap: var(--space-6);

	@container (width > 15rem) {
		--columns: 2;
	}

	@container (width > 25rem) {
		--columns: 4;
	}

	@container (width > 40rem) {
		--columns: 6;

		> *:nth-last-child(4) {
			grid-column: 2;
		}
	}

	@container (width > 55rem) {
		--columns: 8;

		> *:nth-last-child(4) {
			grid-column: unset;
		}
	}
}
</style>
