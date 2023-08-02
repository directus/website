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
	<div class="base-text" :class="[`align-${align}`]" v-html="content" />
</template>

<style lang="scss" scoped>
.base-text {
	font-family: var(--family-body);
	font-size: var(--font-size-base);
	line-height: var(--line-height-xl);
	color: var(--gray-500);
	text-align: v-bind(align);

	/* First child element should have no top margin */
	:deep(:first-child) {
		margin-block-start: 0;
	}

	/* Last child element should have no bottom margin */
	:deep(:last-child) {
		margin-block-end: 0;
	}

	/* Base Size */
	:deep(p) {
		margin-block: var(--space-4);
	}

	:deep(ul) {
		margin-block: var(--space-6);
	}

	:deep(ol) {
		margin-block: var(--space-6);
	}

	:deep(ul),
	:deep(ol) {
		padding-inline-start: var(--space-6);
	}

	:deep(li) {
		margin-block: var(--space-2);
	}

	:deep(li) {
		margin-block: var(--space-2);
	}

	:deep(h1),
	:deep(h2),
	:deep(h3),
	:deep(h4),
	:deep(h5),
	:deep(h6) {
		font-family: var(--family-display);
	}

	:deep(h1) {
		font-size: var(--font-size-2xl);
		line-height: var(--line-height-2xl);
		font-weight: 700;
		margin-block-start: var(--space-8);
		margin-block-end: var(--space-6);
	}

	:deep(h2) {
		font-size: var(--font-size-xl);
		line-height: var(--line-height-xl);
		font-weight: 700;
		margin-block-start: var(--space-8);
		margin-block-end: var(--space-4);
	}

	:deep(h3) {
		font-size: var(--font-size-lg);
		line-height: var(--line-height-lg);
		font-weight: 700;
		margin-block-start: var(--space-8);
		margin-block-end: var(--space-4);
	}

	:deep(h4) {
		font-size: var(--font-size-base);
		line-height: var(--line-height-base);
		font-weight: 700;
		margin-block-start: var(--space-8);
		margin-block-end: var(--space-4);
	}

	:deep(h5) {
		font-size: var(--font-size-sm);
		line-height: var(--line-height-sm);
		font-weight: 700;
		margin-block-start: var(--space-8);
		margin-block-end: var(--space-4);
	}

	:deep(h6) {
		font-size: var(--font-size-xs);
		line-height: var(--line-height-xs);
		font-weight: 700;
		margin-block-start: var(--space-8);
		margin-block-end: var(--space-4);
	}
}
</style>
