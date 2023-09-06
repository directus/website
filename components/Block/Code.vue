<script setup lang="ts">
import type { ThemeInput } from 'shikiji';
import { getHighlighter } from 'shikiji';
import type { BlockProps } from './types';

const { $directus, $readItem } = useNuxtApp();

const props = defineProps<BlockProps>();

const { data: block } = useAsyncData(props.uuid, () =>
	$directus.request(
		$readItem('block_code', props.uuid, {
			fields: ['background', 'snippets'],
		})
	)
);

const shiki = await getHighlighter({
	themes: [
		import('~/assets/shiki/directus-light.json') as unknown as ThemeInput,
		import('~/assets/shiki/directus-dark.json') as unknown as ThemeInput,
	],
	langs: ['graphql', 'http', 'typescript', 'sql', 'json'],
});

const snippets = computed(() =>
	unref(block)?.snippets?.map((snippet) => ({
		...snippet,
		html: shiki.codeToHtml(snippet.snippet, {
			lang: snippet.language,
			theme: unref(block)?.background === 'dark-night' ? 'directus-dark' : 'directus-light',
		}),
	}))
);

const activeSnippet = ref(0);
</script>

<template>
	<ThemeProvider v-if="block" :variant="block.background === 'dark-night' ? 'dark' : null">
		<div class="block-code">
			<div class="buttons">
				<button
					v-for="(snippet, index) in snippets"
					:key="snippet.name"
					:class="{ active: activeSnippet === index }"
					@click="activeSnippet = index"
				>
					{{ snippet.name }}
				</button>
			</div>

			<!-- eslint-disable vue/no-v-html -->
			<div
				v-for="(snippet, index) in snippets"
				v-show="activeSnippet === index"
				:key="snippet.name"
				class="snippet"
				v-html="snippet.html"
			/>
		</div>
	</ThemeProvider>
</template>

<style lang="scss" scoped>
.block-code {
	border-radius: var(--rounded-xl);
	background-color: var(--background);
	aspect-ratio: 16/9;
	display: flex;
	flex-direction: column;
	border-radius: var(--rounded-2xl);
	box-shadow: var(--shadow-base);
	overflow: hidden;
}

.buttons {
	display: flex;
	gap: var(--space-2);
	padding: var(--space-2) var(--space-5);
	overflow-x: auto;

	button {
		flex-shrink: 0;
		color: var(--gray-400);
		font-size: var(--font-size-sm);
		line-height: var(--line-height-sm);
		font-weight: 600;
		padding: var(--space-1) var(--space-2);
		background-color: transparent;
		transition: background-color var(--duration-150) var(--ease-out);
		border-radius: var(--rounded-lg);
		cursor: pointer;

		&:hover {
			background-color: color-mix(in srgb, transparent, var(--foreground) 5%);
			transition: none;
		}
	}

	.active {
		color: var(--foreground);
		background-color: color-mix(in srgb, transparent, var(--foreground) 5%);
	}
}

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
