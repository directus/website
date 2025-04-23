<script setup lang="ts">
import type { BlockProps } from './types';
import useVisualEditing from '~/composables/useVisualEditing';

const { $directus, $readItem } = useNuxtApp();
const { autoApply, setAttr, isVisualEditingEnabled } = useVisualEditing();

const props = defineProps<BlockProps>();

const { data: block, refresh } = useAsyncData(props.uuid, () =>
	$directus.request(
		$readItem('block_cta', props.uuid, {
			fields: ['id', 'heading', 'icon', 'subheading', 'button'],
		}),
	),
);

autoApply(`[data-block-id="${props.uuid}"]`, refresh);
</script>

<template>
	<BasePanel
		v-if="block"
		:data-block-id="props.uuid"
		:data-directus="
			isVisualEditingEnabled
				? setAttr({
						collection: 'block_cta',
						item: block.id,
						fields: ['heading', 'icon', 'subheading', 'button'],
						mode: 'modal',
					})
				: undefined
		"
	>
		<template #header>
			<BaseDirectusImage v-if="block.icon" class="icon" :height="25" :uuid="block.icon as string" alt="" />
		</template>

		<BaseHeading v-if="block.heading" class="heading" size="medium" :content="block.heading" />
		<BaseText v-if="block.subheading" :content="block.subheading" />

		<template #footer>
			<BlockButton v-if="block.button" :uuid="block.button as string" />
		</template>
	</BasePanel>
</template>

<style lang="scss" scoped>
.icon {
	block-size: var(--space-12);
	inline-size: var(--space-12);
}

.heading {
	margin-block-end: var(--space-2);
}
</style>
