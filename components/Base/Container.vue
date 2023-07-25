<script setup lang="ts">
interface BaseContainerProps {
	tag?: 'div' | 'header' | 'footer' | 'section';
}

withDefaults(defineProps<BaseContainerProps>(), {
	tag: 'div',
});
</script>

<template>
	<component :is="tag" class="container">
		<slot />
	</component>
</template>

<style scoped lang="scss">
.container {
	display: grid;
	grid-template-columns:
		[full-start] minmax(var(--space-2), 1fr)
		[standard-start] 0
		[narrow-start] minmax(var(--space-4), 67.5rem)
		[narrow-end] 0
		[standard-end] minmax(var(--space-2), 1fr)
		[full-end];
	position: relative;

	@media (min-width: 50rem) {
		grid-template-columns:
			[full-start] minmax(var(--space-8), 1fr)
			[standard-start] var(--space-16)
			[narrow-start] minmax(var(--space-4), 67.5rem)
			[narrow-end] var(--space-16)
			[standard-end] minmax(var(--space-8), 1fr)
			[full-end];
	}
}

.container :deep(> *) {
	/** acts as an overridable default */
	grid-column: standard;
}
</style>
