<script setup lang="ts">
interface BaseButtonGroupProps {
	size?: 'small' | 'medium' | 'large';
}

withDefaults(defineProps<BaseButtonGroupProps>(), {
	size: 'medium',
});
</script>

<template>
	<div class="button-group-container">
		<div class="button-group" :class="{ size }">
			<slot />
		</div>
	</div>
</template>

<style lang="scss" scoped>
.button-group {
	display: flex;
	gap: var(--space-3);
	flex-wrap: wrap;
	justify-content: center;

	:deep(> *) {
		flex-shrink: 0;
	}
}
</style>
