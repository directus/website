<script setup lang="ts">
import type { BlockProps } from './types';
import useVisualEditing from '~/composables/useVisualEditing';

const { $directus, $readItem } = useNuxtApp();
const { autoApply, setAttr, isVisualEditingEnabled } = useVisualEditing();

const {
	public: { directusUrl },
} = useRuntimeConfig();

const props = defineProps<BlockProps>();

const { data: block, refresh } = useAsyncData(props.uuid, () =>
	$directus.request(
		$readItem('block_paper', props.uuid, {
			fields: ['id', 'background', 'padding', 'background_image', { blocks: ['id', 'collection', 'item'] }],
		}),
	),
);

const backgroundImageUrl = computed(() => {
	if (block.value && block.value.background === 'image' && block.value.background_image) {
		const url = new URL(`/assets/${block.value.background_image}`, directusUrl as string);
		return url.toString();
	}

	return null;
});

autoApply(`[data-block-id="${props.uuid}"]`, refresh);
</script>

<template>
	<ThemeProvider
		v-if="block"
		:variant="['dark-night', 'colorful', 'primary', 'image'].includes(block.background) ? 'dark' : null"
	>
		<div
			class="block-paper"
			:class="[`padding-${block.padding}`, `bg-${block.background}`]"
			:style="
				block.background === 'image' && backgroundImageUrl
					? {
							background: `linear-gradient(0deg, rgba(0, 0, 0, 0.25) 0%, rgba(0, 0, 0, 0.25) 100%), url(${backgroundImageUrl}) no-repeat center/cover`,
						}
					: null
			"
			:data-block-id="props.uuid"
			:data-directus="
				isVisualEditingEnabled
					? setAttr({
							collection: 'block_paper',
							item: block.id,
							fields: ['background', 'padding', 'background_image', 'blocks'],
							mode: 'modal',
						})
					: undefined
			"
		>
			<BaseBlock
				v-for="row in block.blocks"
				:key="row.id"
				class="block"
				:type="row.collection"
				:uuid="row.item as string"
			/>
		</div>
	</ThemeProvider>
</template>

<style lang="scss" scoped>
.block-paper {
	background-color: var(--background);
	border-radius: var(--rounded-2xl);

	@container (width > 35rem) {
		padding: var(--space-20);
	}
}

.padding-small {
	padding: var(--space-5);
}

.padding-normal {
	padding: var(--space-10);
}

.padding-large {
	padding: var(--space-16);
}

.block + .block {
	margin-block-start: var(--space-4);

	@container (width > 35rem) {
		margin-block-start: var(--space-8);
	}
}

.bg-pristine-white {
	box-shadow: var(--shadow-lg);
}

.bg-simple-gray {
	background-color: var(--gray-100);
}

.bg-primary {
	background-color: var(--primary-600);
}

.bg-primary-light {
	background-color: var(--primary-50);
}

.bg-colorful {
	background: url('~/assets/svg/gradient.svg');
	background-size: cover;
}
</style>
