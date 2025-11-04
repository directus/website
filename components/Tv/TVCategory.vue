<template>
	<div class="category">
		<div class="top">
			<div class="title">
				<h2>{{ title }}</h2>
				<div class="badge" color="light">{{ shows.length }} {{ shows.length > 1 ? 'Shows' : 'Show' }}</div>
			</div>
			<div v-if="canScroll" class="nav">
				<button :class="{ active: !leftLimit }" @click="scroll('left')">
					<BaseIcon name="arrow_circle_left" size="medium" />
				</button>
				<button :class="{ active: !rightLimit }" @click="scroll('right')">
					<BaseIcon name="arrow_circle_right" size="medium" />
				</button>
			</div>
		</div>
		<div :class="{ 'left-shadow': !leftLimit, 'right-shadow': !rightLimit }" class="scroller-container">
			<ul ref="scroller" @scroll="determineScrollLimits">
				<li v-for="show in shows" :key="show.shows_id.id">
					<TVShow
						:slug="show.shows_id.slug"
						:tile="show.shows_id.tile"
						:title="show.shows_id.title"
						:description="show.shows_id.one_liner"
						:overlay="show.shows_id.card_text"
					/>
				</li>
			</ul>
		</div>
	</div>
</template>

<script setup>
defineProps({
	title: String,
	shows: Array,
});

const scroller = ref(null);
const canScroll = ref(false);
const rightLimit = ref(false);
const leftLimit = ref(true);

function determineScrollLimits() {
	const s = scroller.value;
	canScroll.value = s.clientWidth < s.scrollWidth;
	leftLimit.value = s.scrollLeft == 0;
	rightLimit.value = s.scrollWidth - Math.round(s.scrollLeft) == s.offsetWidth;
}

function scroll(val) {
	const showWidth = parseInt(getComputedStyle(scroller.value.children[0]).getPropertyValue('width'));

	if (val == 'right') {
		scroller.value.scrollLeft += showWidth;
	}

	if (val == 'left') {
		scroller.value.scrollLeft -= showWidth;
	}
}

onMounted(() => {
	determineScrollLimits();
	window.addEventListener('resize', determineScrollLimits);
});

onUnmounted(() => {
	window.removeEventListener('resize', determineScrollLimits);
});
</script>

<style lang="scss" scoped>
.category {
	.top {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 0.5rem;
		.title {
			--title-color: var(--gray-600);
			display: flex;
			align-items: center;
			gap: 0.5rem;
			h2 {
				color: var(--title-color);
				font-size: 1rem;
				margin: 0;
			}
			.badge {
				background: #393f48;
				font-size: 0.75rem;
				padding: 0 0.5em;
				height: 20px;
				display: flex;
				align-items: center;
				justify-content: center;
				border-radius: 2rem;
			}
		}
		.nav {
			display: flex;
			gap: 0.5rem;
		}
		button {
			opacity: 0.25;
			&.active {
				opacity: 1;
				cursor: pointer;
			}
		}
	}
	.scroller-container {
		width: 100%;
		position: relative;
		&.left-shadow:before,
		&.right-shadow:after {
			content: '';
			display: block;
			z-index: 1;
			position: absolute;
			top: 0;
			bottom: 0;
			pointer-events: none;
			width: 50px;
			height: 100%;
			opacity: 0.5;
		}
		&.left-shadow:before {
			left: 0;
			background: linear-gradient(90deg, rgba(0, 0, 0, 1), rgba(0, 0, 0, 0));
		}
		&.right-shadow:after {
			right: 0;
			background: linear-gradient(90deg, rgba(0, 0, 0, 0), rgba(0, 0, 0, 1));
		}
	}
	ul {
		--show-gap: 10px;
		--show-size: 300px;
		margin-top: 0;
		padding-left: 0;
		list-style-type: none;
		gap: var(--show-gap);
		overflow-x: auto;
		padding-bottom: 1em;
		display: flex;
		scroll-snap-type: x mandatory;
		scroll-behavior: smooth;

		scrollbar-width: thin;
		scrollbar-color: var(--gray-100) transparent;

		&::-webkit-scrollbar {
			height: 8px;
		}

		&::-webkit-scrollbar-track {
			background: transparent;
			border-radius: 4px;
		}

		&::-webkit-scrollbar-thumb {
			background-color: var(--gray-100);
			border-radius: 4px;
		}
	}
	li {
		width: var(--show-size);
		flex-shrink: 0;
		scroll-snap-align: start;
	}

	@media (width > 60rem) {
		ul {
			--show-gap: 20px;
			--show-size: 325px;
		}
	}
}
</style>
