<script setup lang="ts"></script>

<template>
	<NuxtErrorBoundary>
		<ThemeProvider variant="light">
			<NavHeader />
			<slot />
			<NavFooter />
		</ThemeProvider>
	</NuxtErrorBoundary>
</template>
