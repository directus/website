<script setup lang="ts">
import type { Creator } from '~/types/schema';
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
					'verified',
					'core_team',
					'links',
					{
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

useSchemaOrg([
	definePerson({
		url: `https://directus.io/creators/${unref(creator)?.slug}`,
		name: userName(unref(creator)) ? undefined,
		description: unref(creator)?.bio ?? undefined,
		image: unref(creator)?.avatar?.id
			? `https://marketing.directus.app/assets/${unref(creator)?.avatar?.id}`
			: undefined,
		sameAs: unref(creator)?.links?.map((link: { services: string; url: string }) => link.url) ?? undefined,
	}),
]);

definePageMeta({
	path: `/creators/:slug`,
});
</script>

<template>
	<PageSection v-if="creator" nav-offset="small" background="pristine-white" class="content">
		<BaseContainer>
			<div class="single-column">
				<BaseButton
					class="back-button"
					label="Back to Templates"
					href="/templates"
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
									<BaseBadge label="Creator" color="gray" />
									<BaseBadge v-if="creator.verified" label="Verified 🏆" color="gray" />
									<BaseBadge v-if="creator.core_team" label="Core Team 🐰" color="gray" />
								</div>
								<BaseHeading
									class="heading"
									tag="h1"
									:content="`${creator.first_name} ${creator.last_name}`"
									size="large"
								/>

								<div class="share-icons">
									<template v-for="{ services, url } in creator?.links" :key="services">
										<NuxtLink :href="url" target="_blank">
											<img :src="dynamicAsset(`/svg/social/${services}.svg`)" :alt="services" />
										</NuxtLink>
									</template>
								</div>
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
								:to="`/templates/${card.slug as string}`"
								:title="card.name"
								:image="(card.image as string) ?? undefined"
								media-style="image-fill-16-9"
								:description="card.description"
							/>
						</BaseCardGroup>
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

	.single-column {
		max-width: 50rem;
		width: 100%;
		margin-inline: auto;

		.back-button {
			margin-block-end: var(--space-10);
			align-self: flex-start;
		}

		.header {
			margin-block-end: var(--space-10);
			background-color: var(--gray-100);
			padding: var(--space-10);
			border-radius: var(--rounded-xl);

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
			padding-block-end: var(--space-10);

			.divider {
				margin-block: var(--space-10);
			}
		}
	}
}

.mt-4 {
	margin-block-start: var(--space-4);
}

.share-icons {
	display: flex;
	align-items: center;
	gap: var(--space-5);

	margin-block-start: var(--space-4);

	img {
		width: var(--space-7);
		height: auto;
		filter: brightness(1);
		transition: filter var(--duration-150) var(--ease-out);

		&:hover {
			transition: none;
			filter: brightness(0.8);
		}
	}

	a {
		font-size: 0;
	}
}
</style>
