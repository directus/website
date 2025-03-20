<script setup lang="ts">
import type { File } from '~/types/schema';
import type { BlockLogoCloudLogo } from '~/types/schema/blocks';
import { Vue3Marquee } from 'vue3-marquee';

const props = defineProps<{
	logos: BlockLogoCloudLogo[];
}>();

const arrayMidpointIndex = Math.ceil((unref(props.logos) ?? []).length / 2);

const topLogoArray = computed(() => {
	const blockLogos = unref(props.logos) ?? [];
	return blockLogos.slice(0, arrayMidpointIndex);
});

const bottomLogoArray = computed(() => {
	const blockLogos = unref(props.logos) ?? [];
	return blockLogos.slice(arrayMidpointIndex);
});
</script>

<template>
	<div v-for="(logoArray, index) in [topLogoArray, bottomLogoArray]" :key="index" class="block-logo-cloud-ticker">
		<Vue3Marquee :clone="true" :duration="30" :direction="index === 1 ? 'reverse' : 'normal'">
			<div class="logo-container">
				<BaseDirectusImage
					v-for="logo in logoArray"
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
.block-logo-cloud-ticker {
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
