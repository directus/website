<script setup lang="ts">
const { $directus, $readItems } = useNuxtApp();
const { path, params } = useRoute();

const { data: resource } = await useAsyncData(
	path,
	() => {
		return $directus.request(
			$readItems('resources', {
				filter: {
					type: {
						slug: {
							_eq: params.type as string,
						},
					},
					slug: {
						_eq: params.slug as string,
					},
				},
				limit: 1,
				fields: [
					'title',
					{
						blocks: ['id', 'collection', 'item', 'spacing', 'sort'],
						type: ['title'],
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

if (!unref(resource)) {
	throw createError({ statusCode: 404, statusMessage: 'resource Not Found' });
}

useHead({
	title: computed(() => unref(resource)?.title ?? null),
});
</script>

<template>
	<PageSection v-if="resource" background="pristine-white-lines">
		<BaseContainer>
			<BaseButton :label="`Back to ${resource.type.title}`" :href="`/${params.type}`" color="secondary" outline />
			<BaseHeading :content="resource.title" />
		</BaseContainer>
	</PageSection>

	<PageBuilder
		v-if="resource"
		:sections="[
			{
				background: 'pristine-white',
				negativeTopMargin: false,
				blocks: resource.blocks,
			},
		]"
	/>
</template>
