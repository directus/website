<script setup lang="ts">
import type { File } from '~/types/schema';
import type { BlockLogoCloudLogo } from '~/types/schema/blocks';
import { Vue3Marquee } from 'vue3-marquee';

const props = defineProps<{
	logos: BlockLogoCloudLogo[];
}>();
</script>

<template>
	<div class="block-logocloud-ticker">
		<Vue3Marquee :clone="true" :duration="30">
			<div class="logo-container">
				<BaseDirectusImage
					v-for="logo in props.logos"
					:key="logo.id"
					:uuid="(logo.directus_files_id as File).id"
					:alt="(logo.directus_files_id as File).description ?? ''"
				/>
				<div class="logo-spacer" />
			</div>
		</Vue3Marquee>
	</div>
</template>

<style scoped lang="scss">
.block-logocloud-ticker {
	position: relative;
	overflow: hidden;
	mask-image: linear-gradient(to right, transparent, black 20%, black 80%, transparent);
	mask-size: 100% 100%;

	.logo-container {
		display: flex;
		gap: var(--space-14);
		position: relative;
	}

	& img {
		flex-shrink: 0;
		max-width: var(--space-48);
		height: var(--space-20);
		object-fit: contain;
	}
}
</style>
