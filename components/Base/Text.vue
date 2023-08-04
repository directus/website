<script setup lang="ts">
export interface BaseTextProps {
	/**
	 * The alignment of the text.
	 */
	align?: 'start' | 'center' | 'end';

	size?: 'small' | 'medium' | 'large';

	content: string;
}

defineProps<BaseTextProps>();
</script>

<template>
	<div class="base-text-container">
		<!-- eslint-disable-next-line vue/no-v-html -->
		<div class="base-text" :class="[`align-${align}`, `size-${size}`]" v-html="content" />
	</div>
</template>

<style scoped>
.base-text-container {
	container-type: inline-size;
}

.base-text {
	font-family: var(--family-body);
	color: var(--gray-400);

	/* @TODO: Add styling for all base elements */
}

.align-start {
	text-align: start;
}

.align-center {
	text-align: center;
}

.align-end {
	text-align: end;
}

.size-small {
	font-size: var(--font-size-sm);
	line-height: var(--line-height-sm);
	font-weight: 400;
}

.size-large {
	@container (width > 35rem) {
		font-size: var(--font-size-lg);
		line-height: var(--line-height-lg);
	}

	font-weight: 500;
}
</style>
