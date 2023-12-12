<script setup lang="ts">
useHead({
	bodyAttrs: { class: 'tv' },
});
</script>

<template>
	<ThemeProvider variant="dark" class="main">
		<slot />
		<NavFooter />
	</ThemeProvider>
</template>

<style lang="scss" scoped>
.main {
	min-height: 100vh;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
}
</style>
