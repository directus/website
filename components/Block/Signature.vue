<script setup lang="ts">
import type { BlockProps } from './types';

const props = defineProps<BlockProps>();

const { $directus, $readItem } = useNuxtApp();

const { data: block } = useAsyncData(props.uuid, () =>
	$directus.request(
		$readItem('block_signature', props.uuid, {
			fields: ['person_name', 'person_title', { person_image: ['id', 'description'] }],
		}),
	));
</script>

<template>
	<div v-if="block" class="block-signature">
		<BaseDirectusImage
			class="image"
			:width="80"
			:height="80"
			:uuid="block.person_image.id"
			:alt="block.person_image.description ?? ''"
		/>
		<div>
			<div class="name">
				{{ block.person_name }}
			</div>
			<div class="title">
				{{ block.person_title }}
			</div>
		</div>
	</div>
</template>

<style lang="scss" scoped>
.block-signature {
	display: flex;
	gap: var(--space-6);
	align-items: center;
}

.image {
	width: var(--space-20);
	height: var(--space-20);
	object-fit: cover;
	border-radius: var(--rounded-full);
	grid-area: image;
	display: none;

	@container (width > 20rem) {
		display: block;
	}
}

.name {
	font-family: var(--family-signature);
	grid-area: name;
	font-size: 3rem;
	z-index: +1;
	position: relative;
}

.title {
	grid-area: title;
	color: var(--gray-400);
	font-style: italic;
}
</style>
