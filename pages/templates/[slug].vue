<script setup lang="ts">
import type { Template } from '~/types/schema';

const { $directus, $readItems } = useNuxtApp();
const { params } = useRoute();

const {
	public: { directusUrl },
} = useRuntimeConfig();

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
					'payment_type',
					'price',
					'use_cases',
					'framework',
					'url_github_repository',
					'url_frontend_demo',
					'url_backend_demo',
					'url_template',
					'directus_plus',
					'cloud_template',
					{
						image: ['id', 'title', 'description'],
						image_gallery: [
							{
								file: ['id', 'title', 'description'],
							},
						],
						creator: ['id', 'first_name', 'last_name', 'github_username', 'avatar', 'slug'],
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

const { data: relatedTemplates } = await useAsyncData(`related-templates-${params.slug}`, () => {
	return $directus.request(
		$readItems('templates', {
			filter: {
				_and: [
					{
						use_cases: {
							// @ts-expect-error - Array of strings funkiness
							_in: unref(template)?.use_cases,
						},
					},
					{
						id: {
							_neq: unref(template)?.id,
						},
					},
				],
			},
			limit: 3,
		}),
	);
});

if (!unref(template)) {
	throw createError({ statusCode: 404, statusMessage: 'Template Not Found', fatal: true });
}

const images = computed(() => {
	const images = [];

	const tmp = unref(template);

	if (tmp?.image) {
		images.push({
			uuid: tmp.image.id,
		});
	}

	if (tmp?.image_gallery) {
		for (const image of tmp.image_gallery) {
			if (image.file) {
				images.push({
					uuid: image.file.id,
				});
			}
		}
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

const modalOpen = ref(false);

const getTemplateAction = computed(() => {
	if (unref(template)?.directus_plus) {
		return {
			label: labels.directus_plus,
			href: '/plus',
			color: 'primary',
			icon: 'arrow_forward',
		};
	}

	if (unref(template)?.cloud_template) {
		return {
			label: labels.cloud,
			href: 'https://directus.cloud/dashboard/',
			color: 'primary',
			target: '_blank',
			icon: 'arrow_forward',
		};
	}

	if (unref(template)?.template_status !== 'available') {
		return;
	}

	if (unref(template)?.payment_type === 'paid') {
		return {
			label: `Buy Now - $${unref(template)?.price}`,
			href: unref(template)?.url_template,
			color: 'primary',
			target: '_blank',
			icon: 'arrow_forward',
		};
	}

	// Default template action (GitHub)
	return {
		label: labels.github,
		href: unref(template)?.url_github_repository,
		color: 'primary',
		target: '_blank',
		icon: 'arrow_forward',
	};
});

const secondaryButtons = computed(() => {
	const buttons = [];

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
			click: () => {
				modalOpen.value = true;
			},
			color: 'secondary',
			outline: true,
			target: '_blank' as const,
			icon: 'play_circle',
		});
	}

	return buttons;
});

const buttons = computed(() => {
	const buttons = [];

	if (getTemplateAction.value) {
		buttons.push(getTemplateAction.value);
	}

	buttons.push(...secondaryButtons.value);

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
				<!-- Desktop:Left Column -->
				<main>
					<BaseButton
						class="back-button"
						label="Back to All Templates"
						href="/templates"
						color="secondary"
						outline
						icon-start="arrow_back"
					/>

					<TemplatesTitle :template="template as Template" class="mobile-only" />

					<!-- Gallery Section -->
					<section v-if="images.length" class="gallery">
						<BaseMedia aspect="16-9" radius="large">
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
									:uuid="image.uuid"
									:alt="`${template?.name} Website`"
									:width="225"
									:height="125"
									loading="lazy"
								/>
							</button>
						</BaseCardGroup>
					</section>

					<TemplatesActions :template="template as Template" :buttons="buttons" class="mobile-only" />

					<section id="overview">
						<BaseHeading tag="h2" :content="`${template?.name} Overview`" size="medium" />
						<BaseText v-if="template?.content" :content="template?.content" color="foreground" />
					</section>
				</main>

				<!-- Desktop:Right Column -->
				<aside>
					<TemplatesTitle :template="template as Template" class="desktop-only" />
					<TemplatesActions :template="template as Template" :buttons="buttons" class="desktop-only" />
				</aside>
			</div>

			<!-- Video Modal -->
			<BaseModal v-model:open="modalOpen" :title="template?.video?.title ?? ''">
				<template #content>
					<div class="modal-content">
						<BaseButton
							label="Close"
							color="secondary"
							outline
							icon-start="close"
							class="close-button"
							@click="modalOpen = false"
						/>
						<BaseMedia aspect="16-9" class="video-container">
							<BaseVideo
								:uuid="template?.video?.file as string"
								:url="template?.video?.url as string"
								:loop="template?.video?.loop"
								:controls="template?.video?.controls"
							/>
						</BaseMedia>
					</div>
				</template>
			</BaseModal>

			<footer v-if="relatedTemplates && relatedTemplates?.length">
				<section class="base-container">
					<BaseHeading tag="h3" :content="`Other Directus Templates`" size="medium" />
					<BaseCardGroup grid="3" class="mt-4">
						<BaseCard
							v-for="relatedTemplate in relatedTemplates"
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
			</footer>
		</BaseContainer>
	</PageSection>
</template>

<style lang="scss" scoped>
.content {
	padding-block-end: var(--space-20);

	.columns {
		display: grid;
		grid-template-columns: 1fr;
		gap: var(--space-10);

		@media (width > 60rem) {
			grid-template-columns: 2fr 1fr;
		}

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

.base-container {
	container-type: inline-size;
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
