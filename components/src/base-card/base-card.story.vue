<script setup lang="ts">
import { reactive } from 'vue';
import BaseCard from './base-card.vue';

const state = reactive({
	title: 'Article Title',
	tag: {
		label: 'Tag',
		href: '#test',
	},
	url: '#',
	img: 'https://images.unsplash.com/photo-1583264725407-fd4b17d8e09c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHw0fHx8ZW58MHx8fHx8&auto=format&fit=crop&w=700&q=60',
	author: 'Bryant Gillespie',
	date: 'Monday, Jul 10, 2023',
	desc: 'A Short Description',
});
</script>

<template>
	<Story title="Base / Card">
		<template #controls>
			<HstText v-model="state.title" title="Title" />
			<HstJson v-model="state.tag" title="Tag" />
			<HstText v-model="state.url" title="URL" />
			<HstText v-model="state.img" title="Image" />
			<HstText v-model="state.author" title="Author" />
			<HstText v-model="state.date" title="Date" />
			<HstText v-model="state.desc" title="Description" />
		</template>

		<BaseCard
			:title="state.title"
			:tag="state.tag"
			:url="state.url"
			:img="state.img"
			:author="state.author"
			:date="state.date"
			:desc="state.desc"
		/>
	</Story>
</template>
