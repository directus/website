<script setup lang="ts">
export interface BaseHeadingProps {
	size?: 'small' | 'medium' | 'large';
}

const props = withDefaults(defineProps<BaseHeadingProps>(), {
	size: 'medium',
});
</script>

<template>x</template>

<style scoped>
.base-heading {
}
</style>
