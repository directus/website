<script setup lang="ts">
import type { Template } from '~/types/marketplace';

defineProps<{
	template: Template;
}>();
</script>

<template>
	<div class="template-title">
		<BaseHeading v-if="template?.name" class="heading" tag="h1" size="large" :content="template?.name" />
		<BaseText v-if="template?.description" size="small" type="subtext" :content="template?.description" class="mt-4" />
	</div>
</template>

<style scoped>
.template-title {
	> * + * {
		margin-block-start: var(--space-4);
	}
}
</style>
