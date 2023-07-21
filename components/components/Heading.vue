<script setup lang="ts">
import { CompHeading } from '~~/types';

defineProps<{
	data: CompHeading;
}>();
</script>

<template>
	<BaseBadge v-if="data.preheading" caps size="large" :label="data.preheading" />
	<BaseHeading v-if="data.heading" :align="data.alignment" :content="data.heading" />
	<BaseText v-if="data.subheading" :align="data.alignment" :content="data.subheading" />
</template>
