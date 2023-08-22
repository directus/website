<script setup lang="ts">
interface BaseContainerProps {
	tag?: 'div' | 'header' | 'footer' | 'section' | 'aside';
	spacing?: 'none' | 'small' | 'medium' | 'large';
}

withDefaults(defineProps<BaseContainerProps>(), {
	tag: 'div',
	spacing: 'none',
});
</script>

<template>
	<component :is="tag" class="base-container" :class="`space-${spacing}`">
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

	@media (width > 60rem) {
		grid-template-columns:
			[full-start] minmax(2rem, 1fr)
			[standard-start] 7rem
			[narrow-start] minmax(1rem, 61rem)
			[narrow-end] 7rem
			[standard-end] minmax(2rem, 1fr)
			[full-end];
	}
}

.base-container :deep(> *) {
	/** acts as an overridable default */
	grid-column: standard;
}

.space-small + * {
	margin-block-start: var(--space-10);
}

.space-medium + * {
	margin-block-start: var(--space-20);
}

.space-large + * {
	margin-block-start: var(--space-32);
}
</style>
