<script setup lang="ts">
defineProps({
	error: Object,
});

() => clearError();
</script>

<template>
	<PageSection background="pristine-white-lines" class="section">
		<BaseContainer class="not-found">
			<BaseHeading class="heading" tag="h1" content="Page Not Found" size="large" />
			<BaseText
				class="text"
				content="The page you requested doesn't exist. Please check to see if it was entered correctly or head back to <a href='/'>our homepage</a>."
				type="subtext"
			/>
		</BaseContainer>
	</PageSection>
</template>

<style lang="scss" scoped>
.not-found {
	padding-block-end: var(--space-32);
}

.heading {
	margin-block-end: var(--space-2);

	@media (width > 50rem) {
		margin-block-end: var(--space-4);
	}
}
</style>
