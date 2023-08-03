<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue';
import type { BlockProps } from './types';

const timerLength = 5000;
const selectedIdx = ref(0);
const beenClicked = ref(false);

const { $directus, $readItem } = useNuxtApp();

const props = defineProps<BlockProps>();

const { data: block } = useAsyncData(props.uuid, () =>
	$directus.request(
		$readItem('block_showcase', props.uuid, {
			fields: [
				{
					items: ['heading', 'icon', 'subheading', { image: ['id', 'description'] }],
				},
			],
		})
	)
);

let timer: NodeJS.Timeout | undefined = undefined;

let observer: IntersectionObserver | undefined = undefined;
const showcaseRef = ref(null);

const handleClick = (itemIdx: number) => {
	selectedIdx.value = itemIdx;
	beenClicked.value = true;
	clearInterval(timer);

	// Stop timer for forever
	setTimeout(() => {
		clearInterval(timer);
	}, timerLength);
};

const startTimer = () => {
	timer = setInterval(() => {
		const items = unref(block)?.items;
		if (!items) return;

		selectedIdx.value = (selectedIdx.value + 1) % items.length;
	}, timerLength);
};

watch(
	selectedIdx,
	(newIdx, oldIdx) => {
		if (newIdx !== oldIdx && !beenClicked.value) {
			clearInterval(timer);
			startTimer();
		}
	},
	{ immediate: true }
);

onMounted(() => {
	const observerOptions = {
		root: null,
		rootMargin: '0px',
		threshold: 0.1,
	};

	observer = new IntersectionObserver((entries) => {
		entries.forEach((entry) => {
			if (entry.isIntersecting && !beenClicked.value) {
				startTimer();
			} else {
				clearInterval(timer);
			}
		});
	}, observerOptions);

	if (showcaseRef.value) {
		observer.observe(showcaseRef.value);
	}
});

onBeforeUnmount(() => {
	clearInterval(timer);

	if (observer && showcaseRef.value) {
		observer.unobserve(showcaseRef.value);
	}
});
</script>

<template>
	<div v-if="block" ref="showcaseRef" class="block-showcase">
		<BaseFrame aspect="16-9" variant="frosted" color="white">
			<div class="transition-group">
				<template v-for="(item, itemIdx) in block.items" :key="item.id">
					<div v-if="item.image" class="image-container" :class="{ 'is-active': selectedIdx === itemIdx }">
						<BaseDirectusImage :uuid="item.image?.id" :alt="item.image?.description ?? ''" />
					</div>
				</template>
			</div>
		</BaseFrame>

		<div class="showcase-buttons">
			<template v-for="(item, itemIdx) in block.items" :key="item.id">
				<button
					class="showcase-button"
					:class="[{ 'is-active': selectedIdx === itemIdx }]"
					@click="handleClick(itemIdx)"
				>
					<div class="timer-bar" :class="{ 'is-active': selectedIdx === itemIdx }">
						<span />
					</div>
					<BaseHeading
						v-if="item.heading"
						font="body"
						size="medium"
						:icon="item.icon ?? undefined"
						:content="item.heading"
					/>
					<BaseText v-if="item.subheading" align="start" :content="item.subheading" />
				</button>
			</template>
		</div>
	</div>
</template>

<style scoped lang="scss">
.showcase-buttons {
	position: relative;
	display: grid;
	grid-template-columns: repeat(3, 1fr);
	gap: var(--space-4);
	margin-top: var(--space-4);
}

.showcase-buttons .showcase-button {
	padding: var(--space-4);
	display: flex;
	flex-direction: column;
	height: 100%;
	text-align: left;
	background: none;
	color: inherit;
	border: none;
	border-radius: var(--rounded-lg);
	transition: background-color 0.5s ease;
	font: inherit;
	cursor: pointer;
	outline: inherit;
	position: relative;
}

.showcase-buttons .showcase-button:hover,
.showcase-buttons .showcase-button.is-active {
	background: rgba(255, 255, 255, 0.2);
	box-shadow: 0px 30px 60px -30px rgba(0, 0, 0, 0.05), 0px 2px 4px 0px rgba(0, 0, 0, 0.05);
	backdrop-filter: blur(2px);
}

.image-container {
	position: absolute;
	opacity: 0;
	transition: opacity 0.5s ease;
}

.image-container.is-active {
	opacity: 1;
}

.timer-bar {
	height: 2px;
	background-color: var(--gray-300);
	width: 100%;
	position: relative;
	margin-bottom: var(--space-2);
}

.timer-bar span {
	position: absolute;
	top: 0;
	left: 0;
	height: 100%;
	width: 100%;
	opacity: 0.5;
	background-color: var(--primary);
	transform: scaleX(1);
	transform-origin: left;
	transition: none;
}

.timer-bar.is-active span {
	opacity: 1;
	transform: scaleX(0);
	transition: transform 5s linear;
}
</style>
