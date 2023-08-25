<script setup lang="ts">
import type { BlockProps } from './types';

const { $directus, $readItem } = useNuxtApp();

const props = defineProps<BlockProps>();

const { data: block } = useAsyncData(props.uuid, () =>
	$directus.request(
		$readItem('block_page_nav', props.uuid, {
			fields: [{ logo: ['id', 'description'] }, 'navigation', 'title'],
		})
	)
);
</script>

<template>
	<nav v-if="block" class="block-page-nav">
		<BaseDirectusImage v-if="block.logo" :uuid="block.logo.id" :alt="block.logo.description ?? ''" />
		<p v-if="block.title">{{ block.title }}</p>

		<ol v-if="block.navigation">
			<li v-for="{ key, label } in block.navigation" :key="key">
				<a :href="`#${key}`">{{ label }}</a>
			</li>
		</ol>
	</nav>
</template>

<style scoped lang="scss">
.block-page-nav {
	display: flex;
	align-items: center;
	font-size: var(--font-size-sm);
	line-height: var(--line-height-sm);
	flex-wrap: wrap;
	gap: var(--space-2);

	@container (width > 35rem) {
		font-size: var(--font-size-base);
		line-height: var(--line-height-base);
	}

	img {
		block-size: var(--space-8);
		width: auto;

		@container (width > 35rem) {
			block-size: var(--space-11);
		}
	}

	p {
		color: var(--purple-400);
		font-weight: 600;
		margin-inline-start: var(--space-2);
	}

	ol {
		margin-inline-start: auto;
		list-style: none;
		padding: 0;
		display: flex;
		gap: var(--space-2);

		@container (width > 35rem) {
			gap: var(--space-10);
		}
	}

	a {
		color: var(--gray-400);
		transition: color var(--duration-150) var(--ease-out);
		text-decoration: none;

		&:hover {
			color: var(--black);
			transition: none;
		}
	}
}
</style>
