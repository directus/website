<script setup lang="ts">
import { useIntersectionObserver, useResizeObserver } from '@vueuse/core';

import type { BlockLogoCloudLogo } from '~/types/schema/blocks';
import type { File } from '~/types/schema';

const props = defineProps<{
	logos: BlockLogoCloudLogo[];
}>();

// Split the logos array into two parts
const halfLength = Math.ceil((unref(props.logos) ?? []).length / 2);

const topLogoArray = computed(() => {
	const blockLogos = unref(props.logos) ?? [];
	return blockLogos.slice(0, halfLength);
});

const bottomLogoArray = computed(() => {
	const blockLogos = unref(props.logos) ?? [];
	return blockLogos.slice(halfLength);
});

const ticker = ref<HTMLElement | null>(null);
const target = ref<HTMLElement | null>(null);
const tickerWidth = ref<number | null>(null);
const isVisible = ref(false);

useIntersectionObserver(
	target,
	([{ isIntersecting }]) => {
		isVisible.value = isIntersecting;
	},
	{
		threshold: 0.25,
	},
);

const duration = computed(() => {
	if (tickerWidth.value) {
		const calculatedDuration = tickerWidth.value / 60; // 60px per second;
		return `${calculatedDuration * 1000}ms`;
	} else return '0ms';
});

// Adjust duration on resize
useResizeObserver(ticker, (entries) => {
	tickerWidth.value = (entries[0].target as HTMLElement).offsetWidth;
});
</script>

<template>
	<div class="block-logocloud-ticker">
		<div ref="target" class="marquee-wrapper">
			<div
				ref="ticker"
				:class="[{ animate: isVisible }, 'marquee']"
				:style="{
					'--marquee-duration': duration,
				}"
			>
				<BaseDirectusImage
					v-for="logo in topLogoArray"
					:key="logo.id"
					:uuid="(logo.directus_files_id as File).id"
					:alt="(logo.directus_files_id as File).description ?? ''"
				/>
			</div>
		</div>
	</div>
	<div class="block-logocloud-ticker">
		<div ref="target" class="marquee-wrapper">
			<div
				ref="ticker"
				:class="[{ animate: isVisible }, 'marquee reverse-marquee']"
				:style="{
					'--marquee-duration': duration,
				}"
			>
				<BaseDirectusImage
					v-for="logo in bottomLogoArray"
					:key="logo.id"
					:uuid="(logo.directus_files_id as File).id"
					:alt="(logo.directus_files_id as File).description ?? ''"
				/>
			</div>
		</div>
	</div>
</template>

<style scoped lang="scss">
.block-logocloud-ticker {
	position: relative;
	display: flex;
	overflow: hidden;

	.marquee-wrapper {
		position: relative;
		width: 100%;
		height: 100%;
		overflow: hidden;
		display: flex;
		justify-content: center;
		align-items: center;

		mask-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 100 100"><defs><linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stop-color="white" stop-opacity="0"/><stop offset="20%" stop-color="white"/><stop offset="80%" stop-color="white"/><stop offset="100%" stop-color="white" stop-opacity="0"/></linearGradient></defs><rect x="0" y="0" width="100" height="100" fill="url(%23gradient)" /></svg>');
		mask-repeat: no-repeat;
		mask-size: 100%;
		mask-position: center center;
	}

	.marquee {
		display: flex;
		gap: var(--space-14);

		&.animate {
			animation: marquee var(--marquee-duration) linear infinite;
		}

		& img {
			flex-shrink: 0;
			max-width: var(--space-48);
			height: var(--space-20);
			object-fit: contain;
		}
		&.reverse-marquee {
			animation: marquee-reverse var(--marquee-duration) linear infinite;
		}
	}
}

@keyframes marquee {
	0% {
		transform: translateX(0);
	}

	100% {
		transform: translateX(calc(-50%));
	}
}

@keyframes marquee-reverse {
	0% {
		transform: translateX(calc(-50%));
	}
	100% {
		transform: translateX(0);
	}
}
</style>
