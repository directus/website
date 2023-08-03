<script setup lang="ts">
import type { BlockProps } from './types';

const { $directus, $readItem } = useNuxtApp();

const props = defineProps<BlockProps>();

const { data: comp } = useAsyncData(props.uuid, () =>
	$directus.request(
		$readItem('block_cta', props.uuid, {
			fields: ['id', 'heading', 'icon', 'subheading', 'button'],
		})
	)
);
</script>

<template>
	<BasePanel v-if="comp">
		<template #header>
			<BaseDirectusImage v-if="comp.icon" class="icon" height="25" :uuid="comp.icon" alt="" />
		</template>

		<BaseHeading v-if="comp.heading" size="small" :content="comp.heading" />
		<BaseText v-if="comp.subheading" :content="comp.subheading" />

		<template #footer>
			<BlockButton v-if="comp.button" :uuid="comp.button" />
		</template>
	</BasePanel>
</template>

<style lang="scss" scoped>

</style>
