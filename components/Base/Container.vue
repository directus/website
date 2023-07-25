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

<style scoped>
.container {
	display: grid;
	grid-template-columns:
		[full-start] minmax(2rem, 1fr) [standard-start] 0 [narrow-start] minmax(1rem, 67.5rem) [narrow-end] 0 [standard-end] minmax(
			2rem,
			1fr
		)
		[full-end];
	position: relative;
	padding: 0;
}

@media (min-width: 50rem) {
	.container {
		grid-template-columns:
			[full-start] minmax(2rem, 1fr) [standard-start] 3.75rem [narrow-start] minmax(1rem, 67.5rem) [narrow-end] 3.75rem [standard-end] minmax(
				2rem,
				1fr
			)
			[full-end];
	}
}
</style>
