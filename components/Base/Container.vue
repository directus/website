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
		[full-start] minmax(1.25rem, 1fr)
		[standard-start] 0
		[narrow-start] minmax(1rem, 70rem)
		[narrow-end] 0
		[standard-end] minmax(1.25rem, 1fr)
		[full-end];
	position: relative;
	padding-inline: 0;

	@media (width > 35rem) {
		grid-template-columns:
			[full-start] minmax(2rem, 1fr)
			[standard-start] 4rem
			[narrow-start] minmax(1rem, 70rem)
			[narrow-end] 4rem
			[standard-end] minmax(2rem, 1fr)
			[full-end];
	}

	@media (width > 50rem) {
		grid-template-columns:
			[full-start]
			minmax(2rem, 1fr)
			[standard-start]
			3.75rem
			[narrow-start]
			minmax(1rem, 67.5rem)
			[narrow-end]
			3.75rem
			[standard-end]
			minmax(2rem, 1fr)
			[full-end];
	}
}

.base-container :deep(> *) {
	/** acts as an overridable default */
	grid-column: standard;
}
</style>
