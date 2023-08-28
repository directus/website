<script setup lang="ts">
import { useIntersectionObserver, useResizeObserver } from '@vueuse/core';
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

const logos = computed(() => {
	// If type is ticker, return 2x of logos so animation is smooth
	if (unref(block)?.type === 'ticker') {
		return [...unref(block).logos, ...unref(block).logos];
	} else return unref(block)?.logos ?? [];
});

const ticker = ref<HTMLElement | null>(null);
const target = ref<HTMLElement | null>(null);
const tickerWidth = ref<number | null>(null);
const isVisible = ref(false);

const { _stop } = useIntersectionObserver(
	target,
	([{ isIntersecting }], _observerElement) => {
		isVisible.value = isIntersecting;
	},
	{
		threshold: 0.25,
	}
);

const duration = computed(() => {
	if (tickerWidth.value) {
		const calculatedDuration = tickerWidth.value / 60; // 60px per second;
		return `${calculatedDuration * 1000}ms`;
	} else return '0ms';
});

// Adjust duration on resize
useResizeObserver(ticker, (entries) => {
	tickerWidth.value = entries[0].target.offsetWidth;
});
</script>

<template>
	<div v-if="block && block.type === 'grid'" class="block-logocloud-grid">
		<BaseDirectusImage
			v-for="logo in logos"
			:key="logo.id"
			:uuid="logo.directus_files_id.id"
			:alt="logo.directus_files_id.description ?? ''"
		/>
	</div>
	<div v-else-if="block && block.type === 'ticker'" class="block-logocloud-ticker">
		<div ref="target" class="marquee-wrapper">
			<div
				ref="ticker"
				:class="[{ animate: isVisible }, 'marquee']"
				:style="{
					'--marquee-duration': duration,
				}"
			>
				<BaseDirectusImage
					v-for="logo in logos"
					:key="logo.id"
					:uuid="logo.directus_files_id.id"
					:alt="logo.directus_files_id.description ?? ''"
				/>
			</div>
		</div>
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

.block-logocloud-ticker {
	position: relative;
	padding: var(--space-8);
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

		// Only way I could think to get the fade out to work regardless of the background
		mask-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 100 100"><defs><linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stop-color="white" stop-opacity="0"/><stop offset="20%" stop-color="white"/><stop offset="80%" stop-color="white"/><stop offset="100%" stop-color="white" stop-opacity="0"/></linearGradient></defs><rect x="0" y="0" width="100" height="100" fill="url(%23gradient)" /></svg>');
		mask-repeat: no-repeat;
		mask-size: 100%;
		mask-position: center center;
	}

	.marquee {
		display: flex;
		gap: var(--space-20);
		&.animate {
			animation: marquee var(--marquee-duration) linear infinite;
		}
		&:hover {
			animation-play-state: paused;
		}
		& img {
			flex-shrink: 0;
			max-width: 200px;
			height: 75px;
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
</style>
