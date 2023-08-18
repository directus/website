<script setup lang="ts">
import type { BlockProps } from './types';

const { $directus, $readItem } = useNuxtApp();

const props = defineProps<BlockProps>();

const { data: block } = useAsyncData(props.uuid, () =>
	$directus.request(
		$readItem('block_resource_slider', props.uuid, {
			fields: [
				{
					resources: [
						{
							resources_id: [
								'id',
								'title',
								'date_published',
								{ author: ['name', { image: ['id', 'description'] }], image: ['id', 'description'] },
							],
						},
					],
				},
			],
		})
	)
);

const {
	active: activeSlide,
	progress,
	direction,
	loop,
	stop,
} = useSlider({ duration: 10000, length: unref(block)?.resources?.length ?? 0 });

loop();
</script>

<template>
	<div v-if="block" class="block-resource-slider" @pointerenter="stop" @pointerleave="loop">
		<TransitionGroup :name="direction">
			<article
				v-for="({ resources_id: resource }, index) in block.resources"
				v-show="activeSlide === index"
				:key="resource.id"
				class="resource"
			>
				<h2>{{ resource.title }}</h2>
				<BaseDirectusImage :uuid="resource.image.id" :alt="resource.image.description ?? ''" />
			</article>
		</TransitionGroup>

		<BaseCircularProgress :percentage="progress" />
		<BaseSlideIndicator v-model="activeSlide" :length="block.resources?.length ?? 0" />
	</div>
</template>
