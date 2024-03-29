<script setup lang="ts">
useHead({
	bodyAttrs: { class: 'tv' },
});

// Generate a unique visitor ID for each user of TV pages to track reactions
const visitorId = useCookie('visitor_id');

if (!visitorId.value) {
	const id = useId();

	visitorId.value = id;
}
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
