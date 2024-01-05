<template>
	<div class="category">
		<h2>{{ title }}</h2>
		<ul>
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
</script>

<style lang="scss" scoped>
.category {
	h2 {
		color: #64748b;
		font-size: 1rem;
		margin: 0 0 0.5rem;
	}
	ul {
		margin-top: 0;
		padding-left: 0;
		list-style-type: none;
		display: flex;
		gap: 2em;
		overflow-x: scroll;
		padding-bottom: 1em;
	}
}
</style>
