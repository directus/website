<script setup lang="ts">
onBeforeRouteLeave(() => clearError());
onBeforeRouteUpdate(() => clearError());
</script>

<template>
	<NuxtLayout>
		<NotFound />
	</NuxtLayout>
</template>
