<script setup lang="ts">
import type { BlockProps } from './types';

const { $directus, $readItem } = useNuxtApp();

const props = defineProps<BlockProps>();

/**
 * @TODO re-enable resource rendering once cloud 500 is resolved
 */

const { data: block } = useAsyncData(props.uuid, () =>
	$directus.request(
		$readItem('block_cardgroup', props.uuid, {
			fields: [
				'direction',
				'aspect_ratio',
				{
					cards: [
						'id',
						'title',
<<<<<<< Updated upstream
=======
						'image',
						'image_size',
>>>>>>> Stashed changes
						'description',
						'external_url',
						'image',
						{ page: ['permalink'] /*, resource: ['type', 'slug'] */ },
					],
				},
			],
		})
	)
);
</script>

<template>
	<div v-if="block" :class="[`direction-${block.direction}`, 'block-cardgroup']">
		<BaseCard
			v-for="card in block.cards"
			:key="card.id"
<<<<<<< Updated upstream
			:title="card.title ?? undefined"
			:image="card.image ?? undefined"
=======
			:title="card.title"
			:image="card.image"
			:image_size="card.image_size"
>>>>>>> Stashed changes
			:description="card.description"
			:href="card.external_url ?? undefined"
			:to="card.page?.permalink /*?? resourcePermalink(card.resource) */ ?? undefined"
		/>
	</div>
</template>

<style lang="scss" scoped>
.block-cardgroup {
	display: grid;
<<<<<<< Updated upstream
	grid-template-columns: repeat(auto-fit, minmax(var(--space-72), 1fr));
=======

	gap: var(--space-8);

	@media (width > 50rem) {
		grid-template-columns: repeat(2, 1fr);
	}
}

.white-group {
	display: grid;

	@media (width > 30rem) {
		grid-template-columns: repeat(2, 1fr);
	}

	@media (width > 50rem) {
		grid-template-columns: repeat(3, 1fr);
	}

	gap: var(--space-8);
}

.resource-group {
	display: grid;
	grid-template-columns: repeat(1, 1fr);
>>>>>>> Stashed changes
	gap: var(--space-8);
}
</style>
