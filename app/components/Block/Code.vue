<script setup lang="ts">
import type { BlockProps } from './types';

const { $directus, $readItem } = useNuxtApp();

const props = defineProps<BlockProps>();

const { data: block } = useAsyncData(props.uuid, () =>
	$directus.request(
		$readItem('block_code', props.uuid, {
			fields: ['background', 'snippets'],
		}),
	),
);

const activeSnippet = ref(0);
</script>

<template>
	<ThemeProvider v-if="block" :variant="block.background === 'dark-night' ? 'dark' : null">
		<div class="block-code">
			<div class="buttons">
				<button
					v-for="(snippet, index) in block.snippets"
					:key="snippet.name"
					:class="{ active: activeSnippet === index }"
					@click="activeSnippet = index"
				>
					{{ snippet.name }}
				</button>
			</div>

			<BaseCodeSnippet
				v-for="(snippet, index) in block.snippets"
				v-show="activeSnippet === index"
				:key="snippet.name"
				:name="snippet.name"
				:background="block.background"
				:snippet="snippet.snippet"
				:language="snippet.language"
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
</style>
