<script setup lang="ts">
import type { BlockProps } from './types';

const props = defineProps<BlockProps>();

const { $directus, $readItem } = useNuxtApp();

const { data: block } = useAsyncData(props.uuid, () =>
	$directus.request(
		$readItem('block_page_nav', props.uuid, {
			fields: ['tag', { logo: ['id', 'description'] }, 'navigation', 'title'],
		}),
	));
</script>

<template>
	<nav v-if="block" class="block-page-nav">
		<BaseDirectusImage v-if="block.logo" :uuid="block.logo.id" :height="32" :alt="block.logo.description ?? ''" />
		<component :is="block.tag" v-if="block.title" class="title">
			{{ block.title }}
		</component>

		<ol v-if="block.navigation">
			<li v-for="{ link, label } in block.navigation" :key="link">
				<a :href="link">{{ label }}</a>
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

	.title {
		font-size: var(--font-size-base);
		line-height: var(--line-height-base);
		color: var(--primary);
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

		a {
			color: var(--gray-400);
			transition: color var(--duration-150) var(--ease-out);
			text-decoration: none;

			&:hover {
				color: var(--foreground);
				transition: none;
			}
		}

		li:first-child a {
			color: var(--foreground);
		}
	}
}
</style>
