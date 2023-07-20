<script setup lang="ts">
interface BlockContainerProps {
	fullWidth?: boolean;
}

defineProps<BlockContainerProps>();
</script>

<template>
	<section class="block-container" :class="{ 'full-width': fullWidth }">
		<slot />
	</section>
</template>

<style scoped>
.block-container {
	position: relative;
	padding: var(--space-12);
}

:not(.full-width) {
	max-width: 72rem;
	margin-inline: auto;
}

.full-width {
	max-width: 100%;
}
</style>
