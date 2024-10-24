<script setup lang="ts">
import { dynamicAsset } from '~/utils/dynamicAsset';

const { params } = useRoute();

const slug = computed(() => params.slug as string);

const { $directus, $readItems } = useNuxtApp();

const {
	public: { directusUrl },
} = useRuntimeConfig();

const { data: creator } = await useAsyncData(
	`creators/${unref(slug)}`,
	() => {
		return $directus.request(
			$readItems('creators', {
				filter: {
					slug: {
						_eq: unref(slug) as string,
					},
				},
				limit: 1,
				fields: [
					'id',
					'first_name',
					'last_name',
					'slug',
					'github_username',
					'npm_username',
					'bio',
					'avatar',
					'links',
					{
						extensions: ['id', 'name', 'description', 'image', 'slug'],
						templates: ['id', 'name', 'description', 'image', 'slug'],
					},
				],
			}),
		);
	},
	{
		transform: (data) => data[0],
	},
);

if (!unref(creator)) {
	throw createError({ statusCode: 404, statusMessage: 'Team Member Not Found', fatal: true });
}

// const ogProps = getOgProps(`${directusUrl}/assets`, 'team', unref(creator));

// defineOgImageComponent('OgImageDefault', ogProps);

useHead({
	title: computed(() => unref(creator)?.first_name ?? null),
});

useServerSeoMeta({
	title: computed(() => unref(creator)?.first_name ?? null),
	description: computed(() => unref(creator)?.bio ?? null),
	ogTitle: computed(() => unref(creator)?.first_name ?? null),
	ogDescription: computed(() => unref(creator)?.bio ?? null),
});

// useSchemaOrg([
// 	definePerson({
// 		url: `https://directus.io/team/${unref(creator)?.slug}`,
// 		name: unref(creator)?.first_name ?? undefined,
// 		description: unref(creator)?.bio ?? undefined,
// 		image: unref(creator)?.avatar?.id ? `https://marketing.directus.app/assets/${unref(creator)?.avatar?.id}` : undefined,
// 		sameAs: unref(creator)?.links?.map((link: { services: string; url: string }) => link.url) ?? undefined,
// 	}),
// ]);

// const resources = computed(() =>
// 	unref(creator)?.resources?.sort((a, b) => (a.date_published! > b.date_published! ? -1 : 1)),
// );

definePageMeta({
	path: `/creators/:slug`,
});
</script>

<template>
	<PageSection v-if="creator" nav-offset="small" background="pristine-white" class="content">
		<BaseContainer>
			<div class="columns">
				<BaseButton
					class="back-button"
					label="Back"
					href="/creators"
					color="secondary"
					outline
					icon-start="arrow_back"
				/>

				<ThemeProvider variant="dark">
					<div class="header">
						<div class="title">
							<BaseDirectusImage
								v-if="creator.avatar"
								class="avatar"
								:width="128"
								:height="128"
								:uuid="creator.avatar"
								:alt="creator.avatar.description ?? creator.name ?? ''"
							/>
							<div class="name">
								<div class="meta">
									<BaseBadge label="Creator" />
								</div>
								<BaseHeading
									class="heading"
									tag="h1"
									:content="`${creator.first_name} ${creator.last_name}`"
									size="large"
								/>
								<BaseText v-if="creator.job_title" size="medium" type="subtext" :content="creator.job_title" />
							</div>
						</div>
					</div>
				</ThemeProvider>

				<main>
					<template v-if="creator.bio">
						<BaseText size="medium" :content="creator.bio" />
						<BaseDivider class="divider" />
					</template>

					<template v-if="creator.templates && creator.templates.length > 0">
						<BaseHeading tag="h2" content="Templates" size="medium" />
						<BaseCardGroup grid="3" direction="horizontal" class="mt-4">
							<BaseCard
								v-for="card in creator.templates ?? []"
								:key="card.id"
								:to="`/templates/${card.slug}`"
								:title="card.name"
								:image="(card.image as string) ?? undefined"
								media-style="image-fill-16-9"
								:description="card.description"
							/>
						</BaseCardGroup>

						<BaseDivider class="divider" />

						<template v-if="creator.extensions && creator.extensions.length > 0">
							<BaseHeading tag="h2" content="Extensions" size="medium" />
							<BaseCardGroup grid="3" direction="horizontal" class="mt-4">
								<BaseCard
									v-for="card in creator.extensions ?? []"
									:key="card.id"
									:to="`/extensions/${card.slug}`"
									:title="card.name"
									:image="(card.image as string) ?? undefined"
									:description="card.description"
									media-style="image-fill-16-9"
								/>
							</BaseCardGroup>
						</template>
					</template>
				</main>
			</div>
		</BaseContainer>
	</PageSection>
</template>

<style lang="scss" scoped>
.content {
	padding-block-start: var(--space-5);

	@media (width > 60rem) {
		padding-block-start: var(--space-10);
	}

	.columns {
		.back-button {
			margin-block-end: var(--space-10);
			align-self: flex-start;

			@media (width > 60rem) {
				grid-column: 1;
				position: sticky;
				top: var(--space-28);
			}
		}

		.header {
			margin-block-end: var(--space-10);
			background-color: var(--gray-100);
			padding: var(--space-10);
			border-radius: var(--rounded-xl);

			@media (width > 60rem) {
				grid-column: 1;
			}

			@media (width > 70rem) {
				grid-column: 2;
			}

			.meta {
				display: flex;
				gap: var(--space-8);
				align-items: center;
				margin-block-end: var(--space-3);
			}

			.title {
				display: flex;
				align-items: center;

				max-inline-size: 45rem;

				.avatar {
					background-color: var(--gray-100);
					object-fit: cover;
					border-radius: var(--rounded-full);
					border: 4px solid var(--white);
				}

				.name {
					margin-inline-start: var(--space-5);
					width: 100%;
				}
			}
		}

		main {
			container-type: inline-size;
			max-inline-size: 50rem;
			padding-block-end: var(--space-10);
			border-block-end: 1px solid var(--gray-200);
			margin-block-end: var(--space-10);

			.divider {
				margin-block: var(--space-10);
			}

			@media (width > 60rem) {
				border: none;
				margin-block-end: 0;
				padding-block-end: 0;
				grid-column: 1;
			}

			@media (width > 70rem) {
				grid-column: 2;
			}
		}

		aside {
			container-type: inline-size;
			order: 2;

			.meta {
				@media (width > 60rem) {
					position: sticky;
					top: var(--space-28);
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

			.share-icons {
				display: flex;
				align-items: center;
				gap: var(--space-5);

				img {
					width: var(--space-7);
					height: auto;
					filter: brightness(1);
					transition: filter var(--duration-150) var(--ease-out);

					&:hover {
						transition: none;
						filter: brightness(0);
					}
				}

				a {
					font-size: 0;
				}
			}

			.related + .related {
				margin-block-start: var(--space-4);
				display: block;
			}

			@media (width > 60rem) {
				order: unset;
				padding-inline-start: var(--space-10);
				border-inline-start: 1px solid var(--gray-200);
			}
		}

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
</style>
