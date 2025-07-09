<script setup lang="ts">
import { useMediaQuery } from '@vueuse/core';
import type { MarketplaceExtension } from '~/types/marketplace';

const route = useRoute();
const extensionName = Array.isArray(route.params.name) ? route.params.name.join('/') : route.params.name;

const { data: extension, error } = await useFetch<MarketplaceExtension>(`/api/extensions/${extensionName}`, {
	key: extensionName,
});

if (!extension.value || error.value) {
	throw createError({
		statusCode: 404,
		statusMessage: 'Extension not found',
	});
}

const images = computed(() => {
	if (!extension.value?.images?.length) return [];

	return extension.value.images.map((url, index) => ({
		src: url as string,
		alt: `${extension.value?.formatted_name ?? 'Extension'} screenshot ${index + 1}`,
	}));
});

useHead({
	title: `${extension.value.formatted_name} - Directus Extensions`,
});

useServerSeoMeta({
	title: `${extension.value.name} - Directus Extensions`,
	description: extension.value.description,
	ogTitle: `${extension.value.name} - Directus Extensions`,
	ogDescription: extension.value.description,
});

const isDesktop = useMediaQuery('(min-width: 60rem)');

useSchemaOrg([
	// @TODO: Add schema.org data
]);

definePageMeta({
	layout: 'marketplace',
});
</script>

<template>
	<PageSection background="pristine-white-lines" spacing="x-small">
		<!-- <BlockPageNav :uuid="extension.id" /> -->
		<BaseContainer v-if="extension" class="content">
			<div class="columns">
				<BaseButton
					class="back-button"
					label="Back to Extensions"
					href="/extensions"
					color="secondary"
					outline
					icon-start="arrow_back"
				/>
				<div class="header">
					<div class="title">
						<BaseBadge v-if="extension?.type" color="primary" size="small" class="badge">
							{{ extension?.type }}
						</BaseBadge>
						<BaseHeading
							v-if="extension?.formatted_name"
							class="heading"
							tag="h1"
							:content="extension?.formatted_name"
						/>
						<BaseText v-if="extension?.description" size="large" type="subtext" :content="extension?.description" />
					</div>
				</div>
				<main>
					<!-- Gallery Section -->
					<MarketplaceGallery v-if="images.length" :images="images" />
					<BaseDivider />
					<MarketplaceActions v-if="!isDesktop" :extension="extension" :buttons="[]" class="mobile-only" />
					<section id="overview">
						<!-- <BaseHeading tag="h2" content="Readme" size="medium" /> -->
						<BaseText
							v-if="extension?.formatted_readme"
							:content="extension?.formatted_readme"
							color="foreground"
							class="mt-4"
						/>
					</section>
				</main>
				<aside>
					<div class="meta">
						<MarketplaceActions v-if="isDesktop" :extension="extension" :buttons="[]" class="desktop-only" />
					</div>
				</aside>
			</div>
			<!-- Video Modal -->
			<!-- <footer v-if="relatedTemplates && relatedTemplates?.length">
				<section class="base-container">
					<BaseHeading tag="h3" :content="`Other Directus Templates`" size="medium" />
					<BaseCardGroup grid="3" class="mt-4">
						<BaseCard
							v-for="relatedextensionin relatedTemplates"
							:key="relatedTemplate.id"
							:title="relatedTemplate?.name ?? ''"
							:image="relatedTemplate?.image as string"
							media-style="image-fill-16-9"
							:to="`/templates/${relatedTemplate?.slug as string}`"
							title-size="small"
							:description="relatedTemplate?.description ?? undefined"
						/>
					</BaseCardGroup>
				</section>
			</footer> -->
		</BaseContainer>
	</PageSection>
</template>

<style lang="scss" scoped>
.content {
	padding-block-end: var(--space-20);

	.columns {
		.back-button {
			margin-block-end: var(--space-10);
			align-self: flex-start;

			@media (width > 60rem) {
				grid-column: 1;
				position: sticky;
				top: var(--space-28);
				z-index: 1;
			}
		}

		.header {
			margin-block-end: var(--space-10);
			display: flex;
			flex-direction: column;
			width: 100%;
			gap: var(--space-10);

			@media (width > 50rem) {
				flex-direction: row;
				align-items: center;
			}

			@media (width > 60rem) {
				grid-column: 1;
			}

			@media (width > 70rem) {
				grid-column: 2;
			}

			figure {
				width: 80px;
				flex-shrink: 0;
			}

			.title {
				width: 100%;
				max-inline-size: 45rem;

				.badge {
					margin-block-end: var(--space-2);
				}

				.heading {
					margin-block-end: var(--space-5);
				}
			}
		}

		main {
			max-inline-size: 50rem;

			> * + * {
				margin-block-start: var(--space-10);
			}

			section {
				padding-block-end: var(--space-10);
				border-block-end: 1px solid var(--gray-200);
			}

			@media (width > 60rem) {
				border: none;
				margin-block-end: 0;
				padding-block-end: 0;
				grid-column: 1;

				:deep(.base-text) {
					--font-size: var(--font-size-lg);
					--line-height: var(--line-height-2xl);
					margin-block-start: var(--space-4);
				}
			}

			@media (width > 70rem) {
				grid-column: 2;
			}
		}

		aside {
			@media (width > 60rem) {
				grid-row: auto;
				grid-column: auto;
				order: unset;
				padding-inline-start: var(--space-10);
				border-inline-start: 1px solid var(--gray-200);
			}

			.meta {
				@media (width > 60rem) {
					position: sticky;
					top: var(--space-28);
				}

				> * + * {
					margin-block-start: var(--space-4);
				}
			}

			h3 {
				margin-block-end: var(--space-3);
				font-size: var(--font-size-xs);
				line-height: var(--line-height-xs);
				color: var(--gray-400);

				&:not(:first-child) {
					margin-block-start: var(--space-10);
				}
			}
		}

		@media (width > 60rem) {
			display: grid;
			grid-template-columns: 1fr var(--space-72);
			gap: 0 var(--space-10);
		}

		@media (width > 70rem) {
			grid-template-columns: auto 1fr var(--space-72);
		}
	}

	footer {
		margin-block-start: var(--space-10);
		background-color: var(--gray-50);
		padding: var(--space-10);
		border-radius: var(--rounded-xl);
	}
}

.modal-content {
	position: relative;
	padding: var(--space-6);

	.close-button {
		position: absolute;
		top: calc(-1 * var(--space-10));
		right: var(--space-6);
		align-self: flex-end;
	}
}

.subdued {
	color: var(--gray-600);
}

.base-container {
	container-type: inline-size;
}

.featured {
	border-radius: var(--rounded-xl);
	object-fit: contain;
}

.mobile-only {
	display: block;

	@media (width > 60rem) {
		display: none;
	}
}

.mt-4 {
	margin-block-start: var(--space-4);
}

.desktop-only {
	display: none;

	@media (width > 60rem) {
		display: block;
	}
}
</style>
