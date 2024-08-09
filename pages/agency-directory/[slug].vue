<script setup lang="ts">
import { formatTitle } from '@directus/format-title';
import type { Project } from '~/types/schema';

const { $directus, $readItems } = useNuxtApp();
const { params } = useRoute();

const {
	public: { directusUrl },
} = useRuntimeConfig();

// Fetch the individual partner
const { data: partner } = await useAsyncData(
	`agency-partners-${params.slug}`,
	() => {
		return $directus.request(
			$readItems('agency_partners', {
				filter: {
					slug: {
						_eq: params.slug as string,
					},
				},
				fields: [
					'id',
					'slug',
					'partner_name',
					'partner_logo',
					'short_description',
					'description',
					'website',
					'tier',
					'region',
					'country',
					'specializations',
					'team_size',
					'links',
					'website_screenshot',
					{
						projects: [
							'id',
							'project_title',
							'slug',
							'short_summary',
							'featured_image',
							'built_with',
							'content',
							{
								image_gallery: ['id', 'directus_files_id'],
							},
						],
					},
				],
				limit: 1,
			}),
		);
	},
	{
		transform: (data) => data[0],
	},
);

// Fetch 3 other partners to display in the footer based on the current partner's region
const { data: relatedPartners } = await useAsyncData(
	`agency-partners-related-${params.slug}`,
	() => {
		return $directus.request(
			$readItems('agency_partners', {
				filter: {
					_and: [
						{
							region: {
								// @ts-ignore
								_in: unref(partner)?.region,
							},
						},
						{
							partner_logo: {
								_nnull: true,
							},
						},
						{
							slug: {
								_neq: params.slug as string,
							},
						},
					],
				},
				fields: ['id', 'partner_name', 'partner_logo', 'short_description', 'slug', 'region', 'country'],
				limit: 4,
			}),
		);
	},
	{
		transform: (data) => data,
	},
);

if (!unref(partner)) {
	throw createError({ statusCode: 404, statusMessage: 'Partner Not Found', fatal: true });
}

const ogProps = getOgProps(`${directusUrl}/assets`, 'agency_partners', unref(partner));
defineOgImageComponent('OgImageDefault', ogProps);

const website = computed(() => {
	if (!unref(partner)?.website) return null;
	const url = new URL(unref(partner)?.website as string);
	url.searchParams.set('ref', 'directus-agency-directory');
	return url.toString();
});

useHead({
	title: unref(partner)?.partner_name ?? null,
	titleTemplate: '%s | Directus Agency Directory',
});

useServerSeoMeta({
	title: unref(partner)?.partner_name ?? null,
	description: unref(partner)?.short_description ?? null,
	ogTitle: unref(partner)?.partner_name ?? null,
	ogDescription: unref(partner)?.short_description ?? null,
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
					label="Back to Directory"
					href="/agency-directory"
					color="secondary"
					outline
					icon-start="arrow_back"
				/>

				<div class="header">
					<BaseMedia v-if="partner?.partner_logo">
						<BaseDirectusImage
							class="featured"
							:width="200"
							:height="200"
							:uuid="partner?.partner_logo as string"
							alt="''"
						/>
					</BaseMedia>
					<div class="title">
						<BaseHeading v-if="partner?.partner_name" class="heading" tag="h1" :content="partner?.partner_name" />
						<BaseText
							v-if="partner?.short_description"
							size="small"
							type="subtext"
							:content="partner?.short_description"
						/>
					</div>
				</div>

				<main>
					<section v-if="partner?.website_screenshot" id="screenshot">
						<BaseMedia class="mt-4">
							<BaseDirectusImage
								:uuid="partner?.website_screenshot as string"
								:alt="`${partner?.partner_name} Website`"
								:width="800"
								loading="lazy"
							/>
						</BaseMedia>
					</section>

					<section v-if="partner?.projects && partner?.projects?.length" id="projects" class="base-container">
						<BaseHeading tag="h3" :content="`${partner?.partner_name} Projects`" size="medium" />
						<BaseCardGroup grid="3" class="mt-4">
							<BaseCard
								v-for="project in partner?.projects as Project[]"
								:key="project.id"
								:title="project?.project_title"
								:image="project?.featured_image as string"
								media-style="image-fill-16-9"
								:to="`/built-with-directus/${project?.slug as string}?agency_partner=${partner?.slug as string}`"
								title-size="small"
							/>
						</BaseCardGroup>
					</section>

					<section id="overview">
						<BaseHeading tag="h3" :content="`${partner?.partner_name} Overview`" size="medium" />
						<BaseText v-if="partner?.description" :content="partner?.description" color="foreground" />
					</section>

					<!-- @TODO: Potentially bring back links when we can trust partners -->
					<!-- <section v-if="partner?.links && partner?.links?.length" class="base-container">
						<BaseHeading tag="h3" :content="`${partner?.partner_name} Links`" size="medium" />
						<BaseCardGroup grid="4" class="mt-4">
							<BaseCard
								v-for="link in partner?.links"
								:key="link.id"
								:title="link?.label"
								:description="link?.description"
								media-style="icon-title"
								icon="arrow_outward"
								:to="link.url"
								target="_blank"
								direction="horizontal"
								title-size="small"
							/>
						</BaseCardGroup>
					</section> -->
				</main>

				<aside>
					<div class="meta">
						<BaseHeading tag="h3" :content="`${partner?.partner_name} Details`" size="small" />
						<BaseButton
							v-if="website"
							label="Visit Website"
							color="primary"
							icon="arrow_forward"
							:href="website"
							target="_blank"
							size="large"
						/>
						<dl class="partner-details">
							<div v-if="partner?.tier" class="row">
								<dt>Status</dt>
								<dd>
									<BaseBadge>{{ partner.tier }} Partner</BaseBadge>
								</dd>
							</div>
							<div v-if="partner?.region" class="row">
								<dt>Region</dt>
								<dd>{{ partner.region ? partner.region.join(', ') : partner?.country }}</dd>
							</div>
							<div v-if="partner?.country" class="row">
								<dt>Country</dt>
								<dd>{{ partner.country }}</dd>
							</div>
							<div v-if="partner?.specializations" class="row">
								<dt>Specialties</dt>
								<dd>
									<ul>
										<li v-for="(specialty, spIdx) in partner?.specializations" :key="spIdx">
											{{ formatTitle(specialty) }}
										</li>
									</ul>
								</dd>
							</div>
							<div class="row">
								<dt>Team Size</dt>
								<dd>{{ partner?.team_size }} people</dd>
							</div>
						</dl>
					</div>
				</aside>

				<footer>
					<section v-if="relatedPartners && relatedPartners?.length" class="base-container">
						<BaseHeading tag="h3" :content="`Other Directus Agencies in ${partner?.region}`" size="medium" />
						<BaseCardGroup grid="4" class="mt-4">
							<BaseCard
								v-for="partner in relatedPartners"
								:key="partner.id"
								:title="partner?.partner_name"
								:image="partner?.partner_logo as string"
								media-style="image-fill-1-1"
								:to="`/agency-directory/${partner?.slug as string}`"
								title-size="small"
								:description="partner?.country ?? undefined"
							/>
						</BaseCardGroup>
					</section>
				</footer>
			</div>
		</BaseContainer>
	</PageSection>
</template>

<style lang="scss" scoped>
.featured {
	border-radius: var(--rounded-xl);
	object-fit: contain;
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
				width: 200px;
				flex-shrink: 0;
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
			container-type: inline-size;
			grid-row: 3;
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
					padding-inline-start: var(--space-4);
					margin-block-start: 0;
					margin-block-end: 0;
				}

				.partner-details {
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

.base-container {
	container-type: inline-size;
}

.mt-4 {
	margin-block-start: var(--space-4);
}
</style>
