<script setup lang="ts">
const overlayEl = ref<SVGElement | null>(null);

const { width, height } = useElementSize(overlayEl);

const viewBox = computed(() => `0 0 ${unref(width)} ${unref(height)}`);
const paths = computed(() => Math.ceil(unref(width) / 12));

const shimmer = () => {
	const svg = unref(overlayEl);

	if (!svg) return;

	const collection = svg.querySelectorAll('path');

	const easingFunctions = [easeInCirc, easeOutCirc, easeInOutCirc];

	const ease = easingFunctions.at(randomInt(0, easingFunctions.length - 1))!;

	collection.forEach((node, i) => {
		setTimeout(() => {
			if (randomInt(0, 100) < 70) return;
			if (node.classList.contains('active')) return;
			node.classList.add('active');
			setTimeout(() => node.classList.remove('active'), 15000);
		}, ease(range(0, collection.length, i)) * 10000);
	});

	setTimeout(shimmer, randomInt(1000, 10000));
};

onMounted(() => {
	shimmer();
});
</script>

<template>
	<div class="art-lines">
		<svg :viewBox="viewBox" fill="none" xmlns="http://www.w3.org/2000/svg">
			<path
				v-for="i in paths"
				:key="i"
				:style="{ '--x': i * 12, '--y': i * 5 }"
				d="M1045 -1844L565.93 -1302.87C549.747 -1284.59 540.81 -1261.02 540.804 -1236.61L540.719 -905.496C540.713 -881.083 531.776 -857.514 515.593 -839.235L55.5428 -319.592C39.3538 -301.306 30.4162 -277.728 30.4162 -253.305L30.4162 -73.166C30.4162 -48.309 21.1586 -24.343 4.44845 -5.94079L-909 1000"
			/>
		</svg>

		<svg ref="overlayEl" class="overlay" :viewBox="viewBox" fill="none" xmlns="http://www.w3.org/2000/svg">
			<path
				v-for="i in paths"
				:key="i"
				:style="{ '--x': i * 12, '--y': i * 5 }"
				d="M1045 -1844L565.93 -1302.87C549.747 -1284.59 540.81 -1261.02 540.804 -1236.61L540.719 -905.496C540.713 -881.083 531.776 -857.514 515.593 -839.235L55.5428 -319.592C39.3538 -301.306 30.4162 -277.728 30.4162 -253.305L30.4162 -73.166C30.4162 -48.309 21.1586 -24.343 4.44845 -5.94079L-909 1000"
			/>
		</svg>
	</div>
</template>

<style lang="scss" scoped>
.art-lines {
	inline-size: 100%;
	block-size: 100%;
	inset-inline-start: 0;
	inset-block-start: 0;
	position: absolute;

	&::after {
		content: '';
		position: absolute;
		inset-block-end: 0;
		inset-inline-start: 0;
		inline-size: 100%;
		block-size: 100%;
		background: linear-gradient(199deg, var(--white) 0%, transparent 100%),
			linear-gradient(19deg, var(--white) 0%, transparent 100%);
	}
}

svg {
	width: 100%;
	height: 100%;
	position: absolute;
	top: 0;
	left: 0;
}

path {
	stroke: var(--gray-200);
	translate: calc(var(--x) * 1px) calc(var(--y) * 1px);
}

.overlay {
	path {
		stroke: var(--gray-400);
		stroke-dasharray: 4000;
		stroke-dashoffset: 4000;

		&.active {
			animation: stroke 15s forwards;
		}
	}
}

@keyframes stroke {
	0% {
		stroke-dashoffset: -4000;
	}

	50% {
		stroke-dashoffset: 0;
	}

	100% {
		stroke-dashoffset: 4000;
	}
}
</style>
