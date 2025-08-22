<script setup lang="ts">
const { pageLayout } = usePageLayout();
</script>

<template>
	<ThemeProvider variant="light">
		<NavHeader />
		<MarketplaceHeader v-if="pageLayout === 'marketplace'" />
		<slot />
		<NavFooter />
	</ThemeProvider>
</template>
