<template>
	<PageSection background="colorful" class="section">
		<BaseContainer class="not-found">
			<BaseHeading class="heading" tag="h1" content="<em>Page</em> Not Found" size="title" />
			<BaseText class="text" content="The page you were looking for cannot be found" />
		</BaseContainer>
	</PageSection>
</template>

<style lang="scss" scoped>
.heading {
	margin-block-end: var(--space-4);

	@media (width > 50rem) {
		margin-block-end: var(--space-8);
	}
}
</style>
