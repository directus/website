<script setup lang="ts">
const props = defineProps({
	error: Object,
});
</script>

<template>
	<NuxtLayout>
		<NotFound :error="error" />
	</NuxtLayout>
</template>
