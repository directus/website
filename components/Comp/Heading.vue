<script setup lang="ts">
import { readItem } from '@directus/sdk';
import type { CompProps } from './types';

const props = defineProps<CompProps>();

const { $directus } = useNuxtApp();

const { data: comp } = useAsyncData(() =>
	$directus.request(
		readItem('comp_heading', props.uuid, {
			fields: ['heading', 'preheading', 'subheading'],
		})
	)
);
</script>

<template>
	<BaseBadge v-if="comp?.preheading" caps size="large">{{ comp.preheading }}</BaseBadge>
	<BaseHeading v-if="comp?.heading">{{ comp.heading }}</BaseHeading>
	<BaseText v-if="comp?.subheading">{{ comp.subheading }}</BaseText>
</template>
