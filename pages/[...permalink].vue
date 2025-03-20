<script setup lang="ts">
import type { PageBuilderSection } from '~/components/PageBuilder.vue';
// For some reason auto import wasn't for this module
import usePostHogFeatureFlag from '../modules/posthog/runtime/composables/usePostHogFeatureFlag';

const { $directus, $readItems } = useNuxtApp();
const { path } = useRoute();
const { getFeatureFlag } = usePostHogFeatureFlag();

const {
	public: { directusUrl },
} = useRuntimeConfig();

const pageFilter = computed(() => {
	let finalPath;

	if (path === '/') {
		finalPath = '/';
	}
	else if (path.endsWith('/')) {
		finalPath = path.slice(0, -1);
	}
	else {
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
						blocks: [
							'id',
							'background',
							'collection',
							'item',
							'negative_offset',
							'spacing',
							'sort',
							'width',
							'key',
							{
								experiment: ['id', 'feature_flag'],
								experiment_variant: ['id', 'key', 'experiment'],
							},
						],
						seo: ['title', 'meta_description', 'no_follow', 'no_index', 'canonical_url', 'json_ld'],
					},
				],
				deep: {
					blocks: {
						_sort: ['sort'],
					} as any /** @TODO type */,
				},
			}),
		);
	},
	{
		transform: (data) => data[0],
	},
);

if (!unref(page)) {
	throw createError({ statusCode: 404, statusMessage: 'Page Not Found', fatal: true });
}

const sections = computed(() => {
	return unref(page)?.blocks?.reduce((acc, block) => {
		const section = acc.at(-1);

		// Determine if the block should be added based on experiment variant
		let addBlock = true;

		if (block.experiment && block.experiment_variant) {
			const featureFlag = getFeatureFlag(block.experiment.feature_flag);

			addBlock = !featureFlag.value
				? block.experiment_variant.key === 'control' // PostHog is blocked or unavailable, show control variant
				: featureFlag.value === block.experiment_variant.key; // PostHog is available, use returned value
		}

		// If the block should not be added, skip to the next iteration
		if (!addBlock) {
			return acc;
		}

		// Create a new section if there's no current section or background differs
		if (!section || section.background !== block.background) {
			acc.push({
				spacing: block.spacing,
				background: block.background,
				negativeTopMargin: block.negative_offset,
				// @TODO type
				blocks: [block as any],
			});
		}
		else {
			// Adjust spacing if needed and add block to current section
			if (block.spacing !== section.spacing) {
				section.spacing = 'medium';
			}

			section.blocks.push(block as any);
		}

		return acc;
	}, [] as PageBuilderSection[]);
});

const ogProps = getOgProps(`${directusUrl}/assets`, 'pages', unref(page));

defineOgImageComponent('OgImageDefault', ogProps);

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
