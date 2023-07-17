<template>
	<div class="button-group"><slot /></div>
</template>

<style>
.button-group {
	display: flex;
	margin-top: 1rem;
	flex-direction: column;
	gap: 2rem;

	@media (min-width: 768px) {
		margin-left: 1rem;
		margin-top: 0;
		flex-direction: row;
	}
}
</style>
