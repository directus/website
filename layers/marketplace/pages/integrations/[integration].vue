<script setup lang="ts">
import type { MarketplaceIntegration } from '~/types/marketplace';

const route = useRoute();
const integrationIdOrSlug = arrayToString(route.params.integration);

const { data: integration, error } = await useFetch<MarketplaceIntegration>(
	`/api/integrations/${integrationIdOrSlug}`,
	{
		key: () => integrationIdOrSlug,
	},
);

if (!integration.value || error.value) {
	throw createError({
		statusCode: 404,
		statusMessage: 'Integration not found',
		fatal: true,
		message: error.value?.message,
	});
}

useHead({
	title: `${integration.value?.name} - Directus Integrations`,
});

useServerSeoMeta({
	title: `${integration.value?.name} - Directus Integrations`,
	description: integration.value?.description,
	ogTitle: `${integration.value?.name} - Directus Integrations`,
	ogDescription: integration.value?.description,
});

useSchemaOrg([
	// @TODO: Add schema.org data
]);
</script>

<template>
	<PageSection background="pristine-white-lines" spacing="x-small">
		<BaseContainer v-if="integration" class="content">
			<div class="columns">
				<BaseButton
					class="back-button"
					label="Back to Integrations"
					href="/integrations"
					color="secondary"
					outline
					icon-start="arrow_back"
				/>
				<div class="header">
					<BaseDirectusImage
						class="logo"
						v-if="integration?.logo"
						:width="200"
						:height="200"
						:uuid="integration.logo"
						:alt="`${integration.name} logo`"
					/>

					<div class="title">
						<BaseBadge v-if="integration?.category" color="primary" size="small" class="badge">
							{{ integration?.category }}
						</BaseBadge>
						<BaseHeading v-if="integration?.name" class="heading" tag="h1" :content="integration?.name" />
						<BaseText v-if="integration?.description" size="large" type="subtext" :content="integration?.description" />
					</div>
				</div>
				<main>
					<!-- Extensions Section -->
					<section v-if="integration?.extensionDetails?.length" id="extensions">
						<BaseHeading tag="h2" content="Extensions" size="medium" />
						<div class="extensions-grid">
							<MarketplaceExtensionCard
								v-for="extension in integration?.extensionDetails"
								:key="extension.id"
								:extension="extension"
								:to="`/extensions/${extension.name}`"
							/>
						</div>
					</section>
					<!-- External Resources Section -->
					<section v-if="integration?.external_resources?.length" id="external-resources">
						<BaseHeading tag="h2" content="Documentation & Resources" size="medium" />
						<div class="external-resources-list">
							<a
								v-for="resource in integration.external_resources"
								:key="resource.id"
								:href="resource.url"
								target="_blank"
								rel="noopener noreferrer"
								class="external-resource-card"
							>
								<div v-if="resource.image" class="resource-image">
									<BaseDirectusImage
										:width="120"
										:height="120"
										:uuid="typeof resource.image === 'string' ? resource.image : resource.image?.id"
										:alt="resource.title"
									/>
								</div>
								<div v-else class="resource-image-placeholder">
									<BaseIcon name="description" size="large" />
								</div>
								<div class="resource-content">
									<h3 class="resource-title">{{ resource.title }}</h3>
									<p v-if="resource.description" class="resource-description">{{ resource.description }}</p>
								</div>
								<BaseIcon name="open_in_new" class="external-link-icon" size="small" />
							</a>
						</div>
					</section>
					<!-- Overview Section -->
					<section id="overview">
						<BaseHeading tag="h2" content="Overview" size="medium" />
						<BaseText v-if="integration?.content" :content="integration?.content" color="foreground" class="mt-4" />
					</section>
				</main>
				<aside>
					<div class="meta">
						<div v-if="integration?.company_website" class="meta-section">
							<h3>Company Website</h3>
							<BaseButton
								:href="integration.company_website"
								:label="integration.company_website"
								color="secondary"
								outline
								icon-start="open_in_new"
								target="_blank"
							/>
						</div>
						<div v-if="integration?.helpful_resources?.length" class="meta-section">
							<h3>Helpful Resources</h3>
							<div class="resources">
								<BaseButton
									v-for="resource in integration.helpful_resources"
									:key="resource.url"
									:href="resource.url"
									:label="resource.title"
									color="secondary"
									outline
									icon-start="open_in_new"
									target="_blank"
								/>
							</div>
						</div>
					</div>
				</aside>
			</div>
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

			.logo {
				flex-shrink: 0;
				border-radius: var(--rounded-lg);
				overflow: hidden;
				background-color: var(--gray-100);
				display: flex;
				align-items: center;
				justify-content: center;

				img {
					width: 100%;
					height: 100%;
					object-fit: cover;
				}
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

				.meta-section {
					&:not(:first-child) {
						margin-block-start: var(--space-8);
					}

					h3 {
						margin-block-end: var(--space-3);
						font-size: var(--font-size-xs);
						line-height: var(--line-height-xs);
						color: var(--gray-400);
						text-transform: uppercase;
						letter-spacing: var(--letter-spacing-wide);
					}

					.resources {
						display: flex;
						flex-direction: column;
						gap: var(--space-2);
					}
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

.extensions-grid {
	display: grid;
	gap: var(--space-6);
	grid-template-columns: 1fr;
	margin-block-start: var(--space-6);
}

.external-resources-list {
	display: flex;
	flex-direction: column;
	gap: var(--space-4);
	margin-block-start: var(--space-6);
}

.external-resource-card {
	display: flex;
	align-items: center;
	gap: var(--space-4);
	padding: var(--space-4);
	border-radius: var(--rounded-lg);
	border: 1px solid var(--gray-200);
	background-color: var(--background);
	color: var(--foreground);
	text-decoration: none;
	transition: all var(--duration-200) var(--ease-out);
	position: relative;

	&:hover {
		border-color: var(--gray-300);
		box-shadow: 0 4px 12px rgb(0 0 0 / 10%);
		transform: translateY(-2px);

		.resource-title {
			color: var(--primary);
		}

		.external-link-icon {
			color: var(--primary);
		}
	}

	&:focus {
		outline: none;
		border-color: var(--primary);
		box-shadow: 0 0 0 3px var(--primary-100);
	}

	&:focus-visible {
		outline: none;
		border-color: var(--primary);
		box-shadow: 0 0 0 3px var(--primary-100);
	}
}

.resource-image {
	flex-shrink: 0;
	width: 120px;
	height: 120px;
	border-radius: var(--rounded-md);
	overflow: hidden;
	background-color: var(--gray-100);
	display: flex;
	align-items: center;
	justify-content: center;

	@media (width <= 30rem) {
		display: none;
	}

	img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}
}

.resource-image-placeholder {
	flex-shrink: 0;
	width: 120px;
	height: 120px;
	border-radius: var(--rounded-md);
	background-color: var(--gray-100);
	display: flex;
	align-items: center;
	justify-content: center;
	color: var(--gray-400);

	@media (width <= 30rem) {
		display: none;
	}
}

.resource-content {
	flex: 1;
	display: flex;
	flex-direction: column;
	gap: var(--space-2);
	min-width: 0;
}

.resource-title {
	font-size: var(--font-size-lg);
	font-weight: 600;
	line-height: var(--line-height-lg);
	margin: 0;
	color: var(--foreground);
	transition: color var(--duration-200) var(--ease-out);
}

.resource-description {
	color: var(--gray-600);
	font-size: var(--font-size-sm);
	line-height: var(--line-height-sm);
	margin: 0;
}

.external-link-icon {
	position: absolute;
	top: var(--space-4);
	right: var(--space-4);
	flex-shrink: 0;
	color: var(--gray-400);
	transition: color var(--duration-200) var(--ease-out);
}

.desktop-only {
	display: none;

	@media (width > 60rem) {
		display: block;
	}
}
</style>
