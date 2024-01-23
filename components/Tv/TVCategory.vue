<template>
	<div class="category">
		<div class="top">
			<h2>{{ title }}</h2>
			<div class="nav">
				<button @click="move('left')">
					<BaseIcon name="chevron_left" size="small" />
				</button>
				<button @click="move('right')">
					<BaseIcon name="chevron_right" size="small" />
				</button>
			</div>
		</div>
		<ul ref="scroller">
			<li v-for="show in shows" :key="show.shows_id.id">
				<TVShow
					:slug="show.shows_id.slug"
					:tile="show.shows_id.tile"
					:title="show.shows_id.title"
					:description="show.shows_id.one_liner"
				/>
			</li>
		</ul>
	</div>
</template>

<script setup>
defineProps({
	title: String,
	shows: Array,
});

const scroller = ref(null);

async function move(val) {
	const showWidth = parseInt(getComputedStyle(scroller.value.children[0]).getPropertyValue('width'));

	if (val == 'right') {
		scroller.value.scrollLeft += showWidth;
	}

	if (val == 'left') {
		scroller.value.scrollLeft -= showWidth;
	}
}
</script>

<style lang="scss" scoped>
.category {
	.top {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 0.5rem;
		h2 {
			color: #64748b;
			font-size: 1rem;
			margin: 0;
		}
		.nav {
			display: flex;
			gap: 0.5rem;
		}
		button {
			background: var(--primary);
			border-radius: 10em;
			width: 2rem;
			height: 2rem;
			display: flex;
			justify-content: center;
			align-items: center;
		}
	}
	ul {
		--show-width: 33.33%;
		--show-gap: 2em;
		margin-top: 0;
		padding-left: 0;
		list-style-type: none;
		gap: 2em;
		overflow-x: auto;
		padding-bottom: 1em;
		display: flex;
		scroll-snap-type: x mandatory;
		scroll-behavior: smooth;
	}
	li {
		width: calc(var(--show-width) - (var(--show-gap) * 0.66));
		flex-shrink: 0;
		scroll-snap-align: start;
	}
}
</style>
