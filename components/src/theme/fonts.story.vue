<template>
	<Story title="Theme / Fonts" :layout="{ type: 'grid', width: '100%' }">
		<Variant title="Display (Poppins)">
			<p class="display" contenteditable>The quick brown fox jumps over the lazy dog</p>
		</Variant>

		<Variant title="Body (Inter)">
			<p class="body" contenteditable>The quick brown fox jumps over the lazy dog</p>
		</Variant>

		<Variant title="Code (Fira Code)">
			<p class="code" contenteditable>The quick brown fox jumps over the lazy dog</p>
		</Variant>
	</Story>
</template>

<style scoped>
.display {
	font-family: var(--family-display);
}

.body {
	font-family: var(--family-body);
}

.code {
	font-family: var(--family-code);
}
</style>
