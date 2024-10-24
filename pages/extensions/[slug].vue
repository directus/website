<script setup lang="ts">
const { $directus, $readItems } = useNuxtApp();
const { params } = useRoute();

const {
	public: { directusUrl },
} = useRuntimeConfig();

const { data: extension } = await useAsyncData(
	`extensions-${params.slug}`,
	() => {
		return $directus.request(
			$readItems('extensions', {
				filter: {
					slug: {
						_eq: params.slug as string,
					},
				},
				fields: ['id', 'slug', 'name', 'description', 'content'],
				limit: 1,
			}),
		);
	},
	{
		transform: (data) => data[0],
	},
);

const { data: relatedTemplates } = await useAsyncData(`related-templates-${params.slug}`, () => {
	return $directus.request(
		$readItems('templates', {
			filter: {
				_and: [
					{
						use_cases: {
							_in: unref(extension)?.use_cases,
						},
					},
					{
						id: {
							_neq: unref(extension)?.id,
						},
					},
				],
			},
			limit: 3,
		}),
	);
});

if (!unref(extension)) {
	throw createError({ statusCode: 404, statusMessage: 'Template Not Found', fatal: true });
}

const images = computed(() => {
	const images = [];

	if (unref(extension)?.image) {
		images.push({
			uuid: unref(extension)?.image.id,
		});
	}

	for (const image of unref(extension)?.image_gallery) {
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

	if (unref(extension)?.directus_plus) {
		buttons.push({
			label: labels.directus_plus,
			href: unref(extension)?.url_github_repository,
			color: 'primary',
			target: '_blank',
			icon: 'arrow_forward',
		});
	}

	if (unref(extension)?.cloud_template) {
		buttons.push({
			label: labels.cloud,
			href: unref(extension)?.url_github_repository,
			color: 'primary',
			target: '_blank',
			icon: 'arrow_forward',
		});
	}

	if (unref(extension)?.url_github_repository) {
		buttons.push({
			label: 'Get Template',
			href: unref(extension)?.url_github_repository,
			color: 'primary',
			target: '_blank',
			icon: 'arrow_forward',
		});
	}

	if (unref(extension)?.url_frontend_demo) {
		buttons.push({
			label: labels.demo,
			href: unref(extension)?.url_frontend_demo,
			color: 'secondary',
			outline: true,
			target: '_blank',
			icon: 'open_in_new',
		});
	}

	if (unref(extension)?.video?.id) {
		buttons.push({
			label: labels.video,
			href: unref(extension)?.video,
			color: 'secondary',
			outline: true,
			target: '_blank',
			icon: 'play_circle',
		});
	}

	return buttons;
});

// const ogProps = getOgProps(`${directusUrl}/assets`, 'templates', unref(extension));
// defineOgImageComponent('OgImageDefault', ogProps);

useHead({
	title: unref(extension)?.name ?? null,
	titleTemplate: '%s | Directus Extensions',
});

// useServerSeoMeta({
// 	title: unref(extension)?.name ?? null,
// 	description: unref(extension)?.description ?? null,
// 	ogTitle: unref(extension)?.name ?? null,
// 	ogDescription: unref(extension)?.description ?? null,
// 	twitterCard: 'summary_large_image',
// });

useSchemaOrg([
	// @TODO: Add schema.org data
]);
</script>

<extension>
	<PageSection background="pristine-white-lines">
		<BaseContainer class="content">
			<div class="columns">
				<main>
					<BaseButton
						class="back-button"
						label="Back to All Templates"
						href="/templates"
						color="secondary"
						outline
						icon-start="arrow_back"
					/>
					<section v-if="images.length" class="gallery">
						<BaseMedia aspect="16-9">
							<BaseDirectusImage v-if="selectedImage" :uuid="selectedImage" :alt="''" :width="800" loading="lazy" />
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
						<BaseHeading tag="h2" :content="`${extension?.name} Overview`" size="medium" />
						<BaseText v-if="extension?.content" :content="extension?.content" color="foreground" />
					</section>
				</main>

				<aside>
					<div class="template-title">
						<BaseHeading v-if="extension?.name" class="heading" tag="h1" size="large" :content="extension?.name" />
						<BaseText
							v-if="extension?.description"
							size="small"
							type="subtext"
							:content="extension?.description"
							class="mt-4"
						/>
					</div>

					<BaseButtonGroup align="left" class="action-buttons">
						<BaseButton
							v-for="button in buttons"
							:key="button.label"
							:label="button.label"
							:href="button.href"
							:color="button.color"
							:outline="button.outline ?? false"
							:target="button.target"
							:icon="button.icon ?? undefined"
							size="large"
							block
						/>
					</BaseButtonGroup>

					<dl class="meta">
						<div v-if="extension?.creator" class="row flex-list">
							<dt class="subdued">By</dt>
							<NuxtLink :href="`/creators/${extension?.creator?.slug}`" class="author-link">
								<BaseByline :image="extension?.creator?.avatar" :name="extension?.creator?.github_username" />
							</NuxtLink>
						</div>
						<div v-if="extension?.framework" class="row">
							<dt class="subdued">Framework</dt>
							<dd>
								<BaseBadge :href="`/templates?framework=${extension?.framework}`">{{ extension?.framework }}</BaseBadge>
							</dd>
						</div>
						<div v-if="extension?.use_cases" class="row">
							<dt class="subdued">Use Cases</dt>
							<dd class="flex-list">
								<BaseBadge
									v-for="use_case in extension.use_cases"
									:key="use_case"
									:href="`/templates?use_cases=${use_case}`"
								>
									{{ use_case }}
								</BaseBadge>
							</dd>
						</div>
					</dl>
				</aside>
			</div>
			<footer v-if="relatedTemplates && relatedTemplates?.length">
				<section class="base-container">
					<BaseHeading tag="h3" :content="`Other Directus Templates`" size="medium" />
					<BaseCardGroup grid="3" class="mt-4">
						<BaseCard
							v-for="relatedTemplate in relatedTemplates"
							:key="relatedTemplate.id"
							:title="relatedTemplate?.name"
							:image="relatedTemplate?.image as string"
							media-style="image-fill-16-9"
							:to="`/templates/${relatedTemplate?.slug as string}`"
							title-size="small"
							:description="relatedTemplate?.description ?? undefined"
						/>
					</BaseCardGroup>
				</section>
			</footer>
		</BaseContainer>
	</PageSection>
</extension>

<style lang="scss" scoped>
.content {
	padding-block-end: var(--space-20);

	.columns {
		main {
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
				grid-column: 1;
			}
		}

		aside {
			container-type: inline-size;

			grid-row: 3;
			grid-column: 2;

			> * + * {
				margin-block-start: var(--space-4);
			}

			@media (width > 60rem) {
				position: sticky;
				top: var(--space-28);
				align-self: start;
				max-height: calc(100vh - var(--space-28));
				overflow-y: auto;
				grid-row: auto;
				grid-column: auto;
				order: unset;
				padding-inline-start: var(--space-10);
				border-inline-start: 1px solid var(--gray-200);
			}

			.meta {
				> * + * {
					margin-block-start: var(--space-4);
				}

				.author-link {
					text-decoration: none;
					color: var(--gray-900);

					&:hover {
						text-decoration: underline;
					}
				}

				dd {
					width: 100%;
					margin-inline-start: 0;
					margin-block-start: 0;
				}
			}
		}

		@media (width > 60rem) {
			display: grid;
			grid-template-columns: 2fr 1fr;
			gap: 0 var(--space-10);
		}
	}

	footer {
		margin-block-start: var(--space-10);
		background-color: var(--gray-50);
		padding: var(--space-10);
		border-radius: var(--rounded-xl);
	}
}

.mt-4 {
	margin-block-start: var(--space-4);
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

.subdued {
	color: var(--gray-600);
}

.flex-list {
	display: flex;
	align-items: center;
	flex-wrap: wrap;
	gap: var(--space-2);
}

.base-container {
	container-type: inline-size;
}
</style>
