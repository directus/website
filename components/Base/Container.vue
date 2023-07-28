<script setup lang="ts">
interface BaseContainerProps {
	tag?: 'div' | 'header' | 'footer' | 'section';
}

withDefaults(defineProps<BaseContainerProps>(), {
	tag: 'div',
});
</script>

<template>
	<component :is="tag" class="base-container">
		<slot />
	</component>
</template>

<style scoped lang="scss">
.base-container {
	display: grid;
	grid-template-columns:
		[full-start] minmax(var(--space-5), 1fr)
		[standard-start] 0
		[narrow-start] minmax(var(--space-4), 70rem)
		[narrow-end] 0
		[standard-end] minmax(var(--space-5), 1fr)
		[full-end];
	position: relative;
	padding-inline: 0;

	@media (width > 50rem) {
		grid-template-columns:
			[full-start] minmax(var(--space-8), 1fr)
			[standard-start] var(--space-16)
			[narrow-start] minmax(var(--space-4), 70rem)
			[narrow-end] var(--space-16)
			[standard-end] minmax(var(--space-8), 1fr)
			[full-end];
	}
}

.base-container :deep(> *) {
	/** acts as an overridable default */
	grid-column: standard;
}
</style>
