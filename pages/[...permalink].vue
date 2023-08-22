<script setup lang="ts">
import type { PageBuilderSection } from '~/components/PageBuilder.vue';

const { $directus, $readItems } = useNuxtApp();
const { path } = useRoute();

const pageFilter = computed(() => {
	let finalPath;

	if (path === '/') {
		finalPath = '/';
	} else if (path.endsWith('/')) {
		finalPath = path.slice(0, -1);
	} else {
		finalPath = path;
	}

	return { permalink: { _eq: finalPath } };
});

const { data: page } = await useAsyncData(
	path,
	() => {
		return $directus.request(
			$readItems('pages', {
				filter: unref(pageFilter),
				limit: 1,
				fields: [
					'title',
					{
						blocks: ['id', 'background', 'collection', 'item', 'negative_offset', 'spacing', 'sort', 'width'],
					},
				],
				deep: {
					blocks: {
						_sort: ['sort'],
					} as any /** @TODO type */,
				},
			})
		);
	},
	{
		transform: (data) => data[0],
	}
);

if (!unref(page)) {
	throw createError({ statusCode: 404, statusMessage: 'Page Not Found' });
}

const sections = computed(() =>
	unref(page)?.blocks?.reduce((acc, block) => {
		const section = acc.at(-1);

		if (!section || section.background !== block.background) {
			acc.push({
				background: block.background,
				negativeTopMargin: block.negative_offset,
				blocks: [block],
			});

			return acc;
		}

		section.blocks.push(block);
		return acc;
	}, [] as PageBuilderSection[])
);

useHead({
	title: computed(() => unref(page)?.title ?? null),
});
</script>

<template>
	<PageBuilder v-if="sections" :sections="sections" />
</template>
