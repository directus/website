<script setup lang="ts">
import { computed, unref } from 'vue';

export interface BaseDividerProps {}

const props = withDefaults(defineProps<BaseDividerProps>(), {});
</script>

<template>
	<div class="base-divider" />
</template>

<style scoped>
.base-divider {
	width: 100%;
	border-top: 1px solid var(--gray-300);
}
</style>
