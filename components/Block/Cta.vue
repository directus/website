<script setup lang="ts">
import type { BlockProps } from './types';

const { $directus, $readItem } = useNuxtApp();

const props = defineProps<BlockProps>();

const { data: block } = useAsyncData(props.uuid, () =>
	$directus.request(
		$readItem('block_cta', props.uuid, {
			fields: ['id', 'heading', 'icon', 'subheading', 'button'],
		})
	)
);
</script>

<template>
	<BasePanel v-if="block">
		<template #header>
			<BaseDirectusImage v-if="block.icon" class="icon" height="25" :uuid="block.icon" alt="" />
		</template>

		<BaseHeading v-if="block.heading" size="small" :content="block.heading" />
		<BaseText v-if="block.subheading" :content="block.subheading" />

		<template #footer>
			<BlockButton v-if="block.button" :uuid="block.button" />
		</template>
	</BasePanel>
</template>

<style lang="scss" scoped></style>
