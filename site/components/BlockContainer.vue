<script setup lang="ts">
interface BlockContainerProps {
	fullWidth?: boolean;
}

withDefaults(defineProps<BlockContainerProps>(), {
	fullWidth: false,
});
</script>
<template>
	<section :class="['block-container', !fullWidth ? ' full-width' : 'constrained']">
		<slot />
	</section>
</template>

<style>
.block-container {
	position: relative;
	padding-left: 3rem;
	padding-right: 3rem;
	padding-top: 3rem;
	padding-bottom: 3rem;
}

.constrained {
	max-width: 72rem;
	margin-left: auto;
	margin-right: auto;
}

.full-width {
	max-width: 100%;
}
</style>
