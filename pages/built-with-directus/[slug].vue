<script setup lang="ts">
import type { AgencyPartner, Project, ProjectFile } from '~/types/schema';

const { $directus, $readItems } = useNuxtApp();
const { params, query } = useRoute();

// Fetch the individual project
const { data: project } = await useAsyncData(
	`agency-partners-${params.slug}`,
	() => {
		return $directus.request(
			$readItems('projects', {
				filter: {
					slug: {
						_eq: params.slug as string,
					},
				},
				fields: [
					'id',
					'project_title',
					'slug',
					'short_summary',
					'featured_image',
					'built_with',
					'use_cases',
					'content',
					'client_name',
					'website',
					'website_screenshot',
					'website_metadata',
					{
						image_gallery: ['id', 'directus_files_id'],
						partner: ['id', 'partner_name', 'slug', 'partner_logo', 'short_description', 'region', 'country'],
					},
				],
				limit: 1,
			}),
		);
	},
	{
		transform: (data) => data[0] as Project,
	},
);

// Fetch 3 other projects to display in the footer
const { data: relatedProjects } = await useAsyncData(
	`projects-related-${params.slug}`,
	() => {
		const filter = {
			_and: [
				{
					slug: {
						_neq: params.slug as string,
					},
				},
			],
		};

		if (unref(project)?.use_cases?.length) {
			filter._and.push({
				// @ts-ignore
				use_cases: {
					_in: unref(project)?.use_cases as string[],
				},
			});
		}

		return $directus.request(
			$readItems('projects', {
				filter,
				fields: ['id', 'project_title', 'slug', 'short_summary', 'featured_image'],
				limit: 3,
			}),
		);
	},
	{
		transform: (data) => data,
	},
);

if (!unref(project)) {
	throw createError({ statusCode: 404, statusMessage: 'Project Not Found', fatal: true });
}

// @TODO: OG image cards
// const ogProps = getOgProps(`${directusUrl}/assets`, 'partners', unref(project));
// defineOgImageComponent('OgImageDefault', ogProps);

const partner = computed(() => {
	return unref(project)?.partner as AgencyPartner | null;
});

const images = computed(() => {
	const images = [];

	if (unref(project)?.website_screenshot) {
		images.push({
			uuid: unref(project)?.website_screenshot,
		});
	}

	for (const image of unref(project)?.image_gallery as ProjectFile[]) {
		images.push({
			uuid: image.directus_files_id,
		});
	}

	return images;
});

const selectedImage = ref(images.value.length ? images.value[0].uuid : null);

const website = computed(() => {
	if (!unref(project)?.website) return null;
	const url = new URL(unref(project)?.website as string);
	url.searchParams.set('ref', 'directus-project-showcase');
	return url.toString();
});

useHead({
	title: unref(project)?.project_title ?? null,
	titleTemplate: '%s | Built With Directus',
});

useServerSeoMeta({
	title: unref(project)?.project_title ?? null,
	description: unref(project)?.short_summary ?? null,
	ogTitle: unref(project)?.project_title ?? null,
	ogDescription: unref(project)?.short_summary ?? null,
	twitterCard: 'summary_large_image',
});

useSchemaOrg([
	// @TODO: Add schema.org data
]);
</script>

<template>
	<PageSection background="pristine-white-lines">
		<BaseContainer class="content">
			<div class="columns">
				<BaseButton
					class="back-button"
					:label="query?.agency_partner ? 'Back to Agency' : 'Back to Projects'"
					:href="query?.agency_partner ? `/agency-directory/${query?.agency_partner}` : '/built-with-directus'"
					color="secondary"
					outline
					icon-start="arrow_back"
				/>

				<div class="header">
					<div class="meta">
						<BaseBadge
							v-for="useCase in project?.use_cases"
							:key="useCase"
							:label="useCase"
							:href="`/built-with-directus?use_cases=${useCase}`"
						/>

						<p v-if="partner" class="subdued">
							<span>Submitted By Agency Partner – &nbsp;</span>
							<NuxtLink :to="`/agency-directory/${partner?.slug as string}`">
								{{ partner?.partner_name }}
							</NuxtLink>
						</p>
					</div>
					<div class="title">
						<BaseHeading v-if="project?.project_title" class="heading" tag="h1" :content="project?.project_title" />
						<BaseText v-if="project?.short_summary" size="small" type="subtext" :content="project?.short_summary" />
					</div>
				</div>

				<main>
					<section v-if="images.length" class="gallery">
						<BaseMedia aspect="16-9">
							<BaseDirectusImage
								v-if="selectedImage"
								:uuid="selectedImage as string"
								:alt="`${project?.project_title} Website`"
								:width="800"
								loading="lazy"
							/>
						</BaseMedia>
						<!-- Show thumnbails ONLY if there are more than one image -->
						<BaseCardGroup v-if="images.length > 1" grid="4" class="mt-4">
							<button
								v-for="image in images"
								:key="image.uuid as string"
								type="button"
								class="gallery-image"
								:class="selectedImage === image.uuid ? 'selected' : ''"
								@click="selectedImage = image.uuid"
							>
								<BaseDirectusImage
									:uuid="image.uuid as string"
									:alt="`${project?.project_title} Website`"
									:width="225"
									:height="125"
									loading="lazy"
								/>
							</button>
						</BaseCardGroup>
					</section>

					<section>
						<BaseHeading tag="h3" content="Project Overview" size="medium" />
						<BaseText v-if="project?.content" :content="project?.content" color="foreground" />
					</section>
				</main>

				<aside>
					<div class="meta">
						<BaseHeading tag="h3" content="Project Details" size="small" />
						<BaseButton
							v-if="website"
							label="View Project"
							color="primary"
							outline
							icon="arrow_forward"
							:href="website"
							target="_blank"
							size="large"
						/>
						<dl class="project-details">
							<div v-if="project?.client_name" class="row">
								<dt>Client</dt>
								<dd>
									{{ project.client_name }}
								</dd>
							</div>
							<div v-if="project?.built_with" class="row">
								<dt>Built With</dt>
								<dd>
									<ul>
										<li v-for="(item, itemIdx) in project?.built_with" :key="itemIdx">
											{{ toTitleCase(item) }}
										</li>
									</ul>
								</dd>
							</div>
							<div v-if="partner" class="row">
								<dt>Agency Partner</dt>
								<dd>
									<BaseCard
										:title="partner?.partner_name"
										:image="partner?.partner_logo as string"
										media-style="image-fill-1-1"
										:to="`/agency-directory/${partner?.slug as string}`"
										:description="partner.region ? partner?.region.join(', ') : undefined"
									/>
								</dd>
							</div>
						</dl>
					</div>
				</aside>

				<footer>
					<section v-if="relatedProjects && relatedProjects?.length" class="base-container">
						<BaseHeading tag="h3" content="Other Directus Projects" size="medium" />
						<BaseCardGroup grid="3" class="mt-4">
							<BaseCard
								v-for="project in relatedProjects"
								:key="project.id"
								:title="project?.project_title"
								:image="(project?.featured_image as string) ?? undefined"
								media-style="image-fill-16-9"
								:to="`/built-with-directus/${project?.slug as string}`"
								title-size="small"
								:description="truncateString(project?.short_summary, 100) ?? ''"
							/>
						</BaseCardGroup>
					</section>
				</footer>
			</div>
		</BaseContainer>
	</PageSection>
</template>

<style lang="scss" scoped>
.header-image {
	background-color: var(--foreground);
	aspect-ratio: 16/9;
	width: 100%;
	margin-inline: auto;
	display: block;
	min-height: 0;
	text-align: center;
}

.featured {
	border-radius: var(--rounded-xl);
	object-fit: contain;
	aspect-ratio: 16/9;
}

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

			@media (width > 60rem) {
				grid-column: 1;
			}

			@media (width > 70rem) {
				grid-column: 2;
			}

			figure {
				width: 200px;
				flex-shrink: 0;
			}

			.meta {
				display: flex;
				flex-wrap: wrap;
				gap: var(--space-4);
				align-items: center;

				.project-details {
					width: 100%;
					display: flex;
					flex-direction: column;
					gap: var(--space-3);

					dl {
						margin-block-start: 0;
						margin-block-end: 0;

						.row {
							width: 100%;
							display: flex;
							flex-direction: column;
							gap: var(--space-1);
						}
					}

					dt {
						width: 100%;
						font-weight: 600;
						font-size: var(--font-size-sm);
						line-height: var(--line-height-sm);
						color: var(--gray-600);
						margin-block-end: var(--space-1);
					}

					dd {
						width: 100%;
						margin-inline-start: 0;
						margin-block-start: 0;
						padding-block-end: var(--space-3);
						border-bottom: 1px solid var(--gray-200);
					}
				}
			}

			.title {
				width: 100%;
				max-inline-size: 45rem;

				.heading {
					margin-block-end: var(--space-5);
				}
			}
		}

		main {
			max-inline-size: 50rem;
			padding-block-end: var(--space-10);
			border-block-end: 1px solid var(--gray-200);
			margin-block-end: var(--space-10);

			> * + * {
				margin-block-start: var(--space-10);
			}

			section:not(:last-child) {
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
			container-type: inline-size;
			grid-row: 4;
			grid-column: 1;

			.meta {
				@media (width > 60rem) {
					position: sticky;
					top: var(--space-28);
				}

				> * + * {
					margin-block-start: var(--space-4);
				}

				ul {
					// list-style-type: none;
					padding-inline-start: var(--space-4);
					margin-block-start: 0;
					margin-block-end: 0;
				}

				.project-details {
					width: 100%;
					display: flex;
					flex-direction: column;
					gap: var(--space-3);

					dl {
						margin-block-start: 0;
						margin-block-end: 0;

						.row {
							width: 100%;
							display: flex;
							flex-direction: column;
							gap: var(--space-1);
						}
					}

					dt {
						width: 100%;
						font-weight: 600;
						font-size: var(--font-size-sm);
						line-height: var(--line-height-sm);
						color: var(--gray-600);
						margin-block-end: var(--space-1);
					}

					dd {
						width: 100%;
						margin-inline-start: 0;
						margin-block-start: 0;
						padding-block-end: var(--space-3);
						border-bottom: 1px solid var(--gray-200);
					}
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

			@media (width > 60rem) {
				grid-row: auto;
				grid-column: auto;
				order: unset;
				padding-inline-start: var(--space-10);
				border-inline-start: 1px solid var(--gray-200);
			}
		}

		footer {
			max-inline-size: 50rem;
			padding-block-start: var(--space-10);

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

		display: grid;
		grid-template-columns: 1fr;

		@media (width > 60rem) {
			display: grid;
			grid-template-columns: 1fr var(--space-64);
			gap: 0 var(--space-10);
		}

		@media (width > 70rem) {
			grid-template-columns: auto 1fr var(--space-64);
		}
	}
}

.mt-4 {
	margin-block-start: var(--space-4);
}

.subdued {
	color: var(--gray-500);
}

.gallery-image {
	cursor: pointer;
	width: 100%;
	overflow: hidden;
	border-radius: var(--rounded-lg);

	&.selected {
		border: 2px solid var(--primary);
	}

	&:focus {
		outline: var(--primary) auto 1px;
	}

	img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		transition: scale var(--duration-300) var(--ease-out);
		&:hover {
			scale: 1.03;
		}
	}
}

.base-container {
	container-type: inline-size;
}
</style>
