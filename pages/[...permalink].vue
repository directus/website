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
					'spacing_top',
					{
						blocks: ['id', 'background', 'collection', 'item', 'negative_offset', 'spacing', 'sort', 'width', 'key'],
						seo: ['title', 'meta_description', 'no_follow', 'no_index', 'canonical_url', 'json_ld'],
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
	throw createError({ statusCode: 404, statusMessage: 'Page Not Found', fatal: true });
}

const sections = computed(() =>
	unref(page)?.blocks?.reduce((acc, block) => {
		const section = acc.at(-1);

		if (!section || section.background !== block.background) {
			acc.push({
				spacing: block.spacing,
				background: block.background,
				negativeTopMargin: block.negative_offset,
				blocks: [block],
			});

			return acc;
		}

		if (block.spacing !== section.spacing) {
			section.spacing = 'medium';
		}

		section.blocks.push(block);
		return acc;
	}, [] as PageBuilderSection[])
);

useHead({
	title: computed(() => unref(page)?.seo?.title ?? unref(page)?.title ?? null),
});

useServerSeoMeta({
	title: computed(() => unref(page)?.seo?.title ?? unref(page)?.title ?? null),
	description: computed(() => unref(page)?.seo?.meta_description ?? null),
	ogTitle: computed(() => unref(page)?.seo?.title ?? unref(page)?.title ?? null),
	ogDescription: computed(() => unref(page)?.seo?.meta_description ?? null),
});

useSchemaOrg([
	defineWebPage({
		url: `https://directus.io${path}`,
		name: unref(page)?.seo?.title ?? unref(page)?.title ?? undefined,
		description: unref(page)?.seo?.meta_description ?? undefined,
	}),
]);
</script>

<template>
	<PageBuilder v-if="sections" :spacing-top="page?.spacing_top" :sections="sections" />
</template>
