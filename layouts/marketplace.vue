<script setup lang="ts"></script>

<template>
	<ThemeProvider variant="light">
		<NavHeader />
		<MarketplaceHeader />
		<slot />
		<NavFooter />
	</ThemeProvider>
</template>
