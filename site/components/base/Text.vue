<script setup lang="ts">
export interface BaseTextProps {
	/**
	 * The content of the text.
	 */
	content: string;

	/**
	 * The alignment of the text.
	 */
	align?: 'start' | 'center' | 'end';
}

defineProps<BaseTextProps>();
</script>

<template>
	<div class="base-text" v-html="content"></div>
</template>

<style scoped>
.base-text {
	font-family: var(--family-body);
	color: var(--gray-500);

	/* TODO: Add styling for all base elements */
}
</style>
