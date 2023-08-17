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
						'id',
						{
							resources_id: [
								'title',
								{
									author: ['name'],
									article: [{ image: ['id', 'description'] }],
									case_study: [{ image: ['id', 'description'] }],
									video: [{ thumbnail: ['id', 'description'] }],
								},
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
			<div
				v-for="({ id, resources_id: resource }, index) in block.resources"
				v-show="activeSlide === index"
				:key="id"
				class="resource"
			>
				{{ resource }}
			</div>
		</TransitionGroup>

		<BaseCircularProgress :percentage="progress" />
		<BaseSlideIndicator v-model="activeSlide" :length="block.resources?.length ?? 0" />
	</div>
</template>
