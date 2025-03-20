<script setup lang="ts">
interface CodeSnippetProps {
	name: string;
	snippet: string;
	language: string;
	background: string;
}

const props = defineProps<CodeSnippetProps>();

// Nuxt server components are still very experimental and not yet ready for production use. By setting up an API route, we can use the server to generate the HTML for the code snippet and offload the bundle size to the server.
const { data } = await useFetch('/api/code-highlighter', {
	key: `code-highlighter${slugify(props.name)}`,
	method: 'POST',
	body: {
		snippet: props.snippet,
		language: props.language,
		background: props.background,
	},
});
</script>

<template>
	<!-- eslint-disable vue/no-v-html -->
	<div class="snippet" v-html="(data as any).html" />
</template>

<style lang="scss" scoped>
.snippet {
	flex-grow: grow;
	height: 100%;
	overflow: auto;
}

:deep(pre.shiki.directus-light),
:deep(pre.shiki.directus-dark) {
	background-color: transparent !important;
	tab-size: 3;
	margin: 0;
	padding: var(--space-5) var(--space-10);
	counter-reset: section;

	.line {
		&::before {
			counter-increment: section;
			content: counter(section);
			display: inline-block;
			margin-inline-end: var(--space-5);
		}
	}
}
</style>
