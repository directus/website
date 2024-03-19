<script setup lang="ts"></script>

<template>
	<ThemeProvider variant="light">
		<NuxtErrorBoundary>
			<NavHeader />
			<slot />
			<NavFooter />
		</NuxtErrorBoundary>
	</ThemeProvider>
</template>
