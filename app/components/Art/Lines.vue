<script setup lang="ts">
const svgEl = ref<SVGElement | null>(null);

const { width, height: windowHeight } = useElementSize(svgEl);

const height = computed(() => Math.max(unref(windowHeight), 800));

const viewBox = computed(() => `0 0 ${unref(width)} ${unref(height)}`);
const paths = computed(() => Math.ceil(unref(width) / 15) + 20);

const shimmer = () => {
	const svg = unref(svgEl);

	if (!svg) return;

	const collection = Array.from(svg.querySelectorAll('path'));

	const luckyPath = collection.at(randomInt(0, collection.length - 1))!;

	if (luckyPath.classList.contains('active')) return;
	luckyPath.classList.add('active');
	setTimeout(() => luckyPath.classList.remove('active'), 15000);

	setTimeout(shimmer, randomInt(500, 3000));
};

onMounted(() => {
	setTimeout(shimmer, randomInt(500, 3000));
});
</script>

<template>
	<div class="art-lines">
		<svg ref="svgEl" :viewBox="viewBox" fill="none" xmlns="http://www.w3.org/2000/svg">
			<path
				v-for="i in paths"
				:key="i"
				:data-index="i"
				:style="{ '--x': (i - 20) * 15, '--y': i * 5 }"
				d="M211.29 -640L31.2938 -443.145C14.446 -424.719 5.10034 -400.658 5.09397 -375.691L5.00964 -45.3948C5.00342 -21.0424 -3.88896 2.471 -19.999 20.7333L-263.576 296.851C-279.692 315.12 -288.585 338.644 -288.585 363.005L-288.585 503.588C-288.585 528.239 -297.69 552.022 -314.153 570.371L-700 1000.41"
			/>
		</svg>
	</div>
</template>

<style lang="scss" scoped>
.art-lines {
	inline-size: 100%;
	block-size: 800px;
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
		background:
			linear-gradient(199deg, var(--background) 0%, transparent 100%),
			linear-gradient(4deg, var(--background) 20%, transparent 100%);
	}
}

svg {
	inline-size: 100%;
	block-size: 100%;
	position: absolute;
	inset-block: 0;
	inset-inline: 0;
}

path {
	stroke: var(--gray-300);
	translate: calc(var(--x) * 1px) calc(var(--y) * 1px);
	stroke-dashoffset: 0;
	stroke-dasharray: 1200;

	&.active {
		animation: stroke 5s forwards linear;
	}
}

@keyframes stroke {
	0% {
		stroke: var(--gray-300);
	}

	5% {
		stroke: var(--background);
	}

	6% {
		stroke-dashoffset: -1000;
	}

	7% {
		stroke: var(--primary-300);
	}

	40% {
		stroke: var(--primary-300);
	}

	70% {
		stroke: var(--gray-300);
	}

	80% {
		stroke-dashoffset: -0;
	}

	100% {
		stroke: var(--gray-300);
		stroke-dashoffset: -0;
	}
}
</style>
