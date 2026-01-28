<script setup lang="ts">
defineProps<{
	length: number;
}>();

const modelValue = defineModel<number>();
</script>

<template>
	<div class="buttons">
		<button
			v-for="index in length"
			:key="index"
			:class="{ active: modelValue === index - 1 }"
			@click="modelValue = index - 1"
		>
			{{ index }}
		</button>
	</div>
</template>

<style lang="scss" scoped>
.buttons {
	--color: var(--foreground);
	--track-color: var(--gray-200);
	--hover-color: var(--gray-500);

	display: flex;
	gap: var(--space-3);

	button {
		width: var(--space-2);
		height: var(--space-2);
		border-radius: var(--rounded-full);
		background-color: var(--track-color);
		font-size: 0;
		cursor: pointer;
		transition: width var(--duration-300) var(--ease-out);
		transition-property: width, background-color;

		&:not(.active):hover {
			background-color: var(--hover-color);
			transition-property: width;
		}

		&.active {
			background-color: var(--color);
			width: var(--space-4);
		}
	}
}
</style>
