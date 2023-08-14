<script setup lang="ts">
const notFoundText = `The page you requested doesn't exist. Please check to see if it was entered correctly or head back to <a href="/">our homepage</a>.`;
</script>

<template>
	<PageSection background="pristine-white-lines" class="section">
		<BaseContainer class="not-found">
			<BaseHeading class="heading" tag="h1" content="<em>Page</em> Not Found" size="large" />
			<BaseText class="text" :content="notFoundText" />
		</BaseContainer>
	</PageSection>
</template>

<style lang="scss" scoped>
.heading {
	margin-block-end: var(--space-2);

	@media (width > 50rem) {
		margin-block-end: var(--space-4);
	}
}
</style>
