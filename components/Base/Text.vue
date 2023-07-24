<script setup lang="ts">
export interface BaseTextProps {
	/**
	 * The alignment of the text.
	 */
	align?: 'start' | 'center' | 'end';

	content: string;
}

defineProps<BaseTextProps>();
</script>

<template>
	<!-- eslint-disable-next-line vue/no-v-html -->
	<div class="base-text" v-html="content" />
</template>

<style scoped>
.base-text {
	font-family: var(--family-body);
	color: var(--gray-500);

	/* TODO: Add styling for all base elements */
}
</style>
