<script setup lang="ts">
interface BaseButtonGroupProps {
	size?: 'small' | 'medium' | 'large';
	align?: 'left' | 'center';
}

withDefaults(defineProps<BaseButtonGroupProps>(), {
	size: 'medium',
	align: 'center',
});
</script>

<template>
	<div class="button-group-container">
		<div class="button-group" :class="`align-${align}`">
			<slot />
		</div>
	</div>
</template>

<style lang="scss" scoped>
.button-group-container {
	container-type: inline-size;
}

.button-group {
	display: flex;
	gap: var(--space-4);
	flex-wrap: wrap;

	&.align-center {
		justify-content: center;
	}

	@container (width > 35rem) {
		gap: var(--space-5);
	}

	:deep(> *) {
		flex-shrink: 0;
	}
}
</style>
