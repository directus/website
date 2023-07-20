<template>
	<div class="button-group"><slot /></div>
</template>

<style scoped>
/**
	@TODO Don't include margins in base components
	@TODO Use container queries instead of media queries for base components
*/

/* .button-group {
	display: flex;
	margin-top: var(--space-4);
	flex-direction: column;
	gap: var(--space-8);
}

@media (min-width: 768px) {
	.button-group {
		margin-left: var(--space-4);
		margin-top: 0;
		flex-direction: row;
	}
} */
</style>
