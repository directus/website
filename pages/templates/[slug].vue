<script setup lang="ts">
import { formatTitle } from '@directus/format-title';
import type { Project } from '~/types/schema';

const { $directus, $readItems } = useNuxtApp();
const { params } = useRoute();

const {
	public: { directusUrl },
} = useRuntimeConfig();

// Fetch the individual template
const { data: template } = await useAsyncData(
	`templates-${params.slug}`,
	() => {
		return $directus.request(
			$readItems('templates', {
				filter: {
					slug: {
						_eq: params.slug as string,
					},
				},
				fields: [
					'id',
					'slug',
					'name',
					'description',
					'template_status',
					'content',
					'use_cases',
					'framework',
					'url_github_repository',
					'url_frontend_demo',
					'url_backend_demo',
					{
						image: ['id', 'title', 'description'],
						image_gallery: [
							{
								file: ['id', 'title', 'description'],
							},
						],
						creator: ['id', 'first_name', 'last_name', 'github_username', 'avatar'],
						video: [
							'id',
							'title',
							'description',
							'type',
							'url',
							'file',
							'thumbnail',
							'transcript',
							'autoplay',
							'controls',
							'loop',
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

console.log('template', unref(template));

if (!unref(template)) {
	throw createError({ statusCode: 404, statusMessage: 'Template Not Found', fatal: true });
}

const images = computed(() => {
	const images = [];

	if (unref(template)?.image) {
		images.push({
			uuid: unref(template)?.image.id,
		});
	}

	for (const image of unref(template)?.image_gallery) {
		images.push({
			uuid: image.file.id,
		});
	}

	return images;
});

const selectedImage = ref(images.value.length ? images.value[0].uuid : null);

const labels = {
	directus_plus: 'Get Directus Plus',
	paid: 'Buy Now',
	cloud: 'Deploy to Directus Cloud',
	github: 'Get Template',
	demo: 'View Demo',
	video: 'Watch Video',
};

const buttons = computed(() => {
	const buttons = [];

	if (unref(template)?.url_github_repository) {
		buttons.push({
			label: 'Get Template',
			href: unref(template)?.url_github_repository,
			color: 'primary',
			target: '_blank',
			icon: 'arrow_forward',
		});
	}

	if (unref(template)?.url_frontend_demo) {
		buttons.push({
			label: labels.demo,
			href: unref(template)?.url_frontend_demo,
			color: 'secondary',
			outline: true,
			target: '_blank',
			icon: 'open_in_new',
		});
	}

	if (unref(template)?.video?.id) {
		buttons.push({
			label: labels.video,
			href: unref(template)?.video,
			color: 'secondary',
			outline: true,
			target: '_blank',
			icon: 'play_circle',
		});
	}

	return buttons;
});

const ogProps = getOgProps(`${directusUrl}/assets`, 'templates', unref(template));
defineOgImageComponent('OgImageDefault', ogProps);

useHead({
	title: unref(template)?.name ?? null,
	titleTemplate: '%s | Directus Templates',
});

useServerSeoMeta({
	title: unref(template)?.name ?? null,
	description: unref(template)?.description ?? null,
	ogTitle: unref(template)?.name ?? null,
	ogDescription: unref(template)?.description ?? null,
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
				<main>
					<section v-if="images.length" class="gallery">
						<BaseMedia aspect="16-9">
							<BaseDirectusImage
								v-if="selectedImage"
								:uuid="selectedImage"
								:alt="''"
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

					<section id="overview">
						<BaseHeading tag="h2" :content="`${template?.name} Overview`" size="medium" />
						<BaseText v-if="template?.content" :content="template?.content" color="foreground" />
					</section>
				</main>

				<aside>
					<div class="title">
						<BaseHeading v-if="template?.name" class="heading" tag="h1" size="x-large" :content="template?.name" />
						<BaseText v-if="template?.description" size="small" type="subtext" :content="template?.description" />
					</div>
					<div class="buttons">
						<BaseButtonGroup align="left" size="large">
							<BaseButton v-for="button in buttons" :key="button.label" v-bind="button" size="large" block />
						</BaseButtonGroup>
					</div>

						<dl class="meta">
							<div v-if="template?.creator" class="row">
								<dt>Template by</dt>
								<BaseByline :image="template?.creator?.avatar as string" :name="template?.creator?.github_username" />
								<!--</NuxtLink> -->
							</div>
							<div v-if="template?.framework" class="row">
								<dt>Framework</dt>
								<dd>{{ template.framework }}</dd>
							</div>
							<div v-if="template?.use_cases" class="row">
								<dt>Use Cases</dt>
								<dd class="list">
									<BaseBadge v-for="use_case in template.use_cases">{{ use_case }}</BaseBadge>
								</dd>
							</div>
						</dl>

				</aside>

				<footer>
					<!-- <section v-if="relatedPartners && relatedPartners?.length" class="base-container">
						<BaseHeading tag="h3" :content="`Other Directus Agencies in ${template?.region}`" size="medium" />
						<BaseCardGroup grid="4" class="mt-4">
							<BaseCard
								v-for="relatedPartner in relatedPartners"
								:key="relatedPartner.id"
								:title="relatedPartner?.partner_name"
								:image="relatedPartner?.partner_logo as string"
								media-style="image-fill-1-1"
								:to="`/agency-directory/${relatedPartner?.slug as string}`"
								title-size="small"
								:description="relatedPartner?.country ?? undefined"
							/>
						</BaseCardGroup>
					</section> -->
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

.player {
	background-color: var(--foreground);
	max-block-size: calc(90vh - var(--space-60));
	aspect-ratio: 16/9;
	width: 100%;
	margin-inline: auto;
	display: block;
	min-height: 0;
	text-align: center;

	> * {
		height: 100%;
		width: auto;
	}
}

.featured {
	border-radius: var(--rounded-xl);
	object-fit: contain;
	aspect-ratio: 16/9;
}

.content {
	padding-block-end: var(--space-20);

	.columns {

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
			grid-row: 4;
			grid-column: 1;

			> * + * {
				margin-block-start: var(--space-4);
			}

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
			display: grid;
			grid-template-columns: 1fr;

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

		@media (width > 60rem) {
			display: grid;
			grid-template-columns: 1fr var(--space-64);
			gap: 0 var(--space-10);
		}

		@media (width > 70rem) {
			grid-template-columns: var(--space-10) 1fr var(--space-96);
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
