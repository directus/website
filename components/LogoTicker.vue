<script setup lang="ts">
import type { BlockLogoCloudLogo } from '~/types/schema/blocks';
import type { File } from '~/types/schema';
import { Vue3Marquee } from 'vue3-marquee';

const props = defineProps<{
	logos: BlockLogoCloudLogo[];
}>();
</script>

<template>
	<div class="block-logocloud-ticker">
		<Vue3Marquee :clone="true" :duration="30" :gradient="true" :gradient-color="[255, 255, 255]" gradient-length="5%">
			<div class="logo-container">
				<BaseDirectusImage
					v-for="logo in props.logos"
					:key="logo.id"
					:uuid="(logo.directus_files_id as File).id"
					:alt="(logo.directus_files_id as File).description ?? ''"
				/>
				<div class="logo-spacer"></div>
			</div>
		</Vue3Marquee>
	</div>
</template>

<style scoped lang="scss">
.block-logocloud-ticker {
	.logo-container {
		display: flex;
		gap: var(--space-14);
	}

	& img {
		flex-shrink: 0;
		max-width: var(--space-48);
		height: var(--space-20);
		object-fit: contain;
	}
}
</style>
