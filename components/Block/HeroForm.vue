<script setup lang="ts">
import type { BlockProps } from './types';

const { $directus, $readItem } = useNuxtApp();

const props = defineProps<BlockProps>();

const { data: block } = useAsyncData(props.uuid, () =>
	$directus.request(
		$readItem('block_hero_form', props.uuid, {
			fields: ['heading', 'subheading', 'form'],
		})
	)
);
</script>

<template>
	<div v-if="block" class="flex">
		<div>
			<BaseHeading v-if="block.heading" size="title" :content="block.heading" />
			<BaseText v-if="block.subheading" :content="block.subheading" />
		</div>
		<div>
			{{ block.form }}
		</div>
	</div>
</template>

<style scoped>
@media (width > 50rem) {
	.flex {
		display: flex;
	}
}
</style>
