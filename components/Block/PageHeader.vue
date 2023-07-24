<script setup lang="ts">
import { readItem } from '@directus/sdk';
import { BlockProps } from './types';

const { $directus } = useNuxtApp();

const props = defineProps<BlockProps>();

const { data: comp } = useAsyncData(() =>
	$directus.request(
		readItem('block_pageheader', props.uuid, {
			fields: [
				'preheading',
				'heading',
				'subheading',
				'alignment',
				{ button_group: [{ buttons: ['external_url', 'page', 'variant', 'label'] }] },
			],
		})
	)
);
</script>

<template>
	<div v-if="comp" class="page-header">
		<BaseBadge v-if="comp.preheading" caps size="large" :label="comp.preheading" />
		<BaseHeading v-if="comp.heading" :align="comp.alignment === 'left' ? 'start' : 'center'" :content="comp.heading" />
		<BaseText
			v-if="comp.subheading"
			:align="comp.alignment === 'left' ? 'start' : 'center'"
			:content="comp.subheading"
		/>
		<BaseButtonGroup v-if="comp.button_group" class="buttons">
			<BaseButton
				v-for="(button, idx) in comp.button_group?.buttons"
				:key="idx"
				:href="button.external_url ?? button.page ?? undefined"
				:variant="button.variant"
			>
				{{ button.label }}
			</BaseButton>
		</BaseButtonGroup>
	</div>
</template>

<style scoped>
.page-header > * + * {
	margin-top: var(--space-4);
}

.buttons {
	width: 100%;
	margin-left: auto;
	margin-right: auto;
	display: flex;
	justify-content: center;
}
</style>
