<script setup lang="ts">
import { BlockShowcase } from '~~/types';
import { ref, watch, onBeforeUnmount, onMounted } from 'vue';

const { fileUrl } = useFiles();

const props = defineProps<{
	data: BlockShowcase;
}>();

const timerLength = 5000;
const selectedIdx = ref(0);
const beenClicked = ref(false);
let timer = null;
let observer = null;
const showcaseRef = ref(null);

function handleClick(itemIdx: number) {
	selectedIdx.value = itemIdx;
	beenClicked.value = true;
	clearInterval(timer);

	// Stop timer for forever
	setTimeout(() => {
		clearInterval(timer);
	}, timerLength);
}

function startTimer() {
	timer = setInterval(() => {
		selectedIdx.value = (selectedIdx.value + 1) % props.data.items.length;
	}, timerLength);
}

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

	observer = new IntersectionObserver((entries, observer) => {
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
	<div class="block-showcase" ref="showcaseRef">
		<!-- Showcase Frame -->
		<BaseFrame aspect="16-9" variant="frosted" color="white">
			<div class="transition-group">
				<template v-for="(item, itemIdx) in data.items" :key="item.id">
					<div class="image-container" :class="{ 'is-active': selectedIdx === itemIdx }">
						<img :src="fileUrl(item.image?.id)" :alt="item.image?.alt" />
					</div>
				</template>
			</div>
		</BaseFrame>
		<!-- Features Buttons -->
		<div class="showcase-buttons">
			<template v-for="(item, itemIdx) in data.items" :key="item.id">
				<button
					class="showcase-button"
					:class="[{ 'is-active': selectedIdx === itemIdx }]"
					@click="handleClick(itemIdx)"
				>
					<div class="timer-bar" :class="{ 'is-active': selectedIdx === itemIdx }">
						<span />
					</div>
					<BaseHeading font="body" size="medium" :icon="item.icon" :content="item.heading" />
					<BaseText align="left" :content="item.subheading" />
				</button>
			</template>
		</div>
	</div>
</template>

<style scoped>
.showcase-buttons {
	position: relative;
	display: grid;
	grid-template-columns: repeat(3, 1fr);
	gap: var(--space-4);
	margin-top: var(--space-4);

	.showcase-button {
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
		&:hover,
		&.is-active {
			background: rgba(255, 255, 255, 0.2);
			box-shadow: 0px 30px 60px -30px rgba(0, 0, 0, 0.05), 0px 2px 4px 0px rgba(0, 0, 0, 0.05);
			backdrop-filter: blur(2px);
		}
	}
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
