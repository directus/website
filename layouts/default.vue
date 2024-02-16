<script setup lang="ts"></script>

<template>
	<NuxtErrorBoundary>
		<ThemeProvider variant="light">
			<slot />
			<NavFooter />
		</ThemeProvider>
	</NuxtErrorBoundary>
</template>
