<script setup lang="ts">
import { readItem } from '@directus/sdk';
import type { CompProps } from './types';

const props = defineProps<CompProps>();

const { $directus } = useNuxtApp();

const { data: comp } = useAsyncData(props.uuid, () =>
	$directus.request(
		readItem('comp_heading', props.uuid, {
			fields: ['heading', 'preheading', 'subheading'],
		})
	)
);
</script>

<template>
	<BaseBadge v-if="comp?.preheading" caps size="large">{{ comp.preheading }}</BaseBadge>
	<BaseHeading v-if="comp?.heading" :content="comp.heading" />
	<BaseText v-if="comp?.subheading" :content="comp.subheading" />
</template>
