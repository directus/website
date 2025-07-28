<script setup lang="ts">
import { useMediaQuery } from '@vueuse/core';
import type { MarketplaceExtension } from '~/types/marketplace';

const route = useRoute();
const extensionIdOrName = arrayToString(route.params.extension);

const { data: extension, error } = await useFetch<MarketplaceExtension>(`/api/extensions/${extensionIdOrName}`, {
	key: () => extensionIdOrName,
});

if (!extension.value || error.value) {
	throw createError({
		statusCode: 404,
		statusMessage: 'Extension not found',
	});
}

const images = computed(() => {
	if (!extension.value?.images?.length) return [];

	return (
		extension.value.images
			.map((url, index) => ({
				src: url as string,
				alt: `${extension.value?.formatted_name ?? 'Extension'} screenshot ${index + 1}`,
			}))
			// For now, only show the first 4 images to keep design tidy
			.slice(0, 4)
	);
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
	defineSoftwareApp({
		'@type': 'SoftwareApplication',
		applicationSubCategory: 'WebApplication',
		name: extension.value.formatted_name || extension.value.name,
		description: extension.value.formatted_description || extension.value.description,
		applicationCategory: 'DeveloperApplication',
		operatingSystem: 'Web-based',
		softwareVersion: extension.value.versions?.[0]?.version ?? 'Unknown',
		author: {
			'@type': extension.value.publisher.github_company ? 'Organization' : 'Person',
			name:
				extension.value.publisher.name || extension.value.publisher.github_name || extension.value.publisher.username,
			url: extension.value.publisher.github_blog || `https://github.com/${extension.value.publisher.github_username}`,
			...(extension.value.publisher.github_avatar_url && {
				image: extension.value.publisher.github_avatar_url,
			}),
		},
		programmingLanguage: ['JavaScript', 'TypeScript'],
		runtimePlatform: 'Directus CMS',
		softwareRequirements: `Directus ${extension.value.host_version}+`,
		license: extension.value.license || 'Unknown',
		...(extension.value.repository_url && {
			downloadUrl: extension.value.repository_url,
		}),
		...(extension.value.name && {
			installUrl: `npm install ${extension.value.name}`,
		}),
		...(extension.value.featured_image && {
			screenshot: extension.value.featured_image,
		}),
		...(extension.value.versions?.[0]?.url_homepage && {
			softwareHelp: {
				'@type': 'CreativeWork',
				url: extension.value.versions[0].url_homepage,
			},
		}),
		...(extension.value.total_downloads && {
			interactionStatistic: {
				'@type': 'InteractionCounter',
				interactionType: 'https://schema.org/DownloadAction',
				userInteractionCount: extension.value.total_downloads,
			},
		}),
	}),
]);

definePageMeta({
	layout: 'marketplace',
});
</script>

<template>
	<PageSection background="pristine-white-lines" spacing="x-small">
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
						<BaseText
							v-if="extension?.formatted_description || extension?.description"
							size="large"
							type="subtext"
							:content="extension?.formatted_description ?? extension?.description"
						/>
					</div>
				</div>
				<main>
					<MarketplaceGallery v-if="images.length && images.length > 1" :images="images" />
					<BaseDivider />
					<MarketplaceActions v-if="!isDesktop" :extension="extension" :buttons="[]" class="mobile-only" />
					<section id="overview">
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
