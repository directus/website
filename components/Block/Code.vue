<script setup lang="ts">
import type { ThemeInput } from 'shikiji';
import { getHighlighter } from 'shikiji';
import type { BlockProps } from './types';

const { $directus, $readItem } = useNuxtApp();

const props = defineProps<BlockProps>();

const { data: block } = useAsyncData(props.uuid, () =>
	$directus.request(
		$readItem('block_code', props.uuid, {
			fields: ['snippets'],
		})
	)
);

const shiki = await getHighlighter({
	themes: [import('~/assets/shiki/directus.json') as unknown as ThemeInput],
	langs: ['graphql', 'http', 'typescript', 'sql', 'json'],
});

const snippets = computed(() =>
	unref(block)?.snippets?.map((snippet) => ({
		...snippet,
		html: shiki.codeToHtml(snippet.snippet, {
			lang: snippet.language,
			theme: 'directus',
		}),
	}))
);

const activeSnippet = ref(0);
</script>

<template>
	<div v-if="block" class="block-code">
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
</template>

<style lang="scss" scoped>
.block-code {
	border-radius: var(--rounded-lg);
	background-color: color-mix(in srgb, transparent, var(--white) 50%);
	backdrop-filter: blur(2px);
	overflow: auto;
	box-shadow: var(--shadow-base);
}

.buttons {
	display: flex;
	gap: var(--space-2);
	border-block-end: 1px solid color-mix(in srgb, transparent, var(--white) 50%);
	padding: var(--space-2) var(--space-5);

	button {
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
			background-color: color-mix(in srgb, transparent, var(--black) 5%);
			transition: none;
		}
	}

	.active {
		color: var(--black);
		background-color: color-mix(in srgb, transparent, var(--black) 5%);
	}
}

:deep(pre.shiki.directus) {
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
