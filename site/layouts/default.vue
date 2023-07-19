<script setup lang="ts"></script>

<template>
	<div class="layout-container">
		<TheHeader />
		<slot />
		<TheFooter />
	</div>
</template>

<style scoped>
.layout-container {
	position: relative;
	display: flex;
	flex-direction: column;
	min-height: 100vh;
	overflow: hidden;
}
</style>
