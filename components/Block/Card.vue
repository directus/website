<script setup lang="ts">
import type { BlockProps } from './types';
import type { Resource, Team } from '~/types/schema';
import { resourcePermalink } from '~/utils/resourcePermalink';
import useVisualEditing from '~/composables/useVisualEditing';

const { $directus, $readItem } = useNuxtApp();
const { autoApply, setAttr, isVisualEditingEnabled } = useVisualEditing();

interface BlockCardProps extends BlockProps {
	direction?: 'vertical' | 'horizontal';
	mediaStyle?:
		| 'none'
		| 'image-fill-16-9'
		| 'image-fill-1-1'
		| 'image-centered-16-9'
		| 'image-centered-1-1'
		| 'icon-centered-16-9'
		| 'icon-centered-1-1'
		| 'image-title'
		| 'icon-title'
		| 'icon-above-title';
	titleSize?: 'small' | 'medium' | 'large';
	iconSize?: 'medium' | 'large';
}

const props = withDefaults(defineProps<BlockCardProps>(), {
	direction: 'vertical',
	mediaStyle: 'image-fill-16-9',
	titleSize: 'medium',
	iconSize: 'large',
});

const { data: block, refresh } = useAsyncData(props.uuid, () =>
	$directus.request(
		$readItem('block_card', props.uuid, {
			fields: [
				'id',
				'title',
				'description',
				'image',
				'external_url',
				'icon',
				'badge',
				{
					page: ['permalink'],
					resource: [
						'slug',
						'title',
						'image',
						'date_published',
						'category',
						{ author: ['name', 'image'], type: ['slug'] },
					],
				},
			],
		}),
	),
);

autoApply(`[data-block-id="${props.uuid}"]`, refresh);
</script>

<template>
	<BaseCard
		v-if="block"
		:data-block-id="props.uuid"
		:title="block.title ?? block.resource?.title ?? undefined"
		:image="((block.image ?? block.resource?.image) as string) ?? undefined"
		:icon="block.icon ?? undefined"
		:media-style="mediaStyle"
		:description="
			block.description ??
			(block.resource?.date_published
				? new Intl.DateTimeFormat('en-US', { dateStyle: 'medium' }).format(
						new Date(block.resource!.date_published as string),
					)
				: undefined) ??
			undefined
		"
		:description-avatar="((block.resource?.author as Team)?.image as string) ?? undefined"
		:to="block.external_url ?? block.page?.permalink ?? resourcePermalink(block.resource as Resource) ?? undefined"
		:layout="direction"
		:badge="block.badge ?? block.resource?.category ?? undefined"
		:title-size="titleSize"
		:icon-size="iconSize"
		:data-directus="
			isVisualEditingEnabled
				? setAttr({
						collection: 'block_card',
						item: block.id,
						fields: [
							'sort',
							'title',
							'description',
							'image',
							'type',
							'icon',
							'badge',
							'external_url',
							'page',
							'resource',
						],
						mode: 'modal',
					})
				: undefined
		"
	/>
</template>
