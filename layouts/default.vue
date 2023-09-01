<script setup lang="ts"></script>

<template>
	<ThemeProvider variant="light">
		<NavHeader />
		<slot />
		<NavFooter />
	</ThemeProvider>
</template>
