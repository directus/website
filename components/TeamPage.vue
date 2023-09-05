<script setup lang="ts">
export interface TeamPageProps {
	slug: string;
}

const props = defineProps<TeamPageProps>();

const { slug } = toRefs(props);

const { $directus, $readItems } = useNuxtApp();
const { fullPath } = useRoute();

const articleUrl = computed(() => `https://directus.io${fullPath}`);

const { data: person } = await useAsyncData(
	`team/${unref(slug)}`,
	() => {
		return $directus.request(
			$readItems('team', {
				filter: {
					slug: {
						_eq: unref(slug) as string,
					},
				},
				limit: 1,
				fields: [
					'name',
					'job_title',
					'bio',
					{
						image: ['id', 'description'],
					},
					'links',
					'slug',
					'type',
					'team',
					{
						resources: [
							'title',
							'summary',
							'category',
							'date_published',
							'image',
							'slug',
							{
								type: ['slug'],
							},
						],
					},
				],
			})
		);
	},
	{
		transform: (data) => data[0],
	}
);

if (!unref(person)) {
	throw createError({ statusCode: 404, statusMessage: 'Team Member Not Found' });
}

useHead({
	title: computed(() => unref(person)?.name ?? null),
});
</script>

<template>
	<PageSection v-if="person" nav-offset="small" background="pristine-white-lines" class="content">
		<BaseContainer>
			<div class="columns">
				<BaseButton
					class="back-button"
					label="Back"
					href="/about#core-team"
					color="secondary"
					outline
					icon-start="arrow_back"
				/>

				<div class="header">
					<div class="title">
						<BaseDirectusImage
							class="avatar"
							:width="150"
							:height="150"
							:uuid="person.image.id"
							:alt="person.image.description ?? person.title ?? ''"
						/>
						<div class="name">
							<div class="meta">
								<BaseBadge v-if="person.team" :label="person.team" />
							</div>
							<BaseHeading class="heading" tag="h1" :content="person.name" />
							<BaseText size="medium" type="subtext" :content="person.job_title" />
						</div>
					</div>
				</div>

				<main>
					<template v-if="person.bio">
						<BaseText size="medium" type="subtext" :content="person.bio" />
						<BaseDivider />
					</template>
					<template v-if="person?.resources">
						<BaseHeading tag="h2" class="heading" size="medium" :content="`Resources by ${person.name}`" />

						<BaseCardGroup grid="6" direction="vertical">
							<BaseCard
								v-for="card in person.resources ?? []"
								:to="`/${card.type.slug}/${card.slug}`"
								:key="card.title"
								:title="card.title"
								:image="card.image ?? undefined"
								media-style="image-fill-16-9"
								:description="card.summary ?? undefined"
								:description-avatar="card.avatar ?? undefined"
								layout="horizontal"
							/>
						</BaseCardGroup>
					</template>
				</main>

				<aside>
					<div class="meta">
						<h3>Links</h3>
						<div class="share-icons">
							<template v-for="{ services, url } in person?.links" :key="services">
								<NuxtLink :href="url" target="_blank">
									<img :src="dynamicAsset(`/svg/social/${services}.svg`)" :alt="services" />
								</NuxtLink>
							</template>
						</div>
					</div>
				</aside>
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
				margin-block-end: var(--space-5);

				time {
					text-transform: uppercase;
					font-size: var(--font-size-xs);
					line-height: var(--line-height-xs);
					font-weight: 600;
					color: var(--gray-400);
				}
			}

			.title {
				display: flex;

				max-inline-size: 45rem;

				.avatar {
					background-color: var(--gray-100);
					object-fit: cover;
					border-radius: var(--rounded-full);
				}

				.name {
					margin-inline-start: var(--space-5);
					width: 100%;
				}

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

			* + * {
				margin-block-start: var(--space-10);
			}

			.featured {
				width: 100%;
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
</style>
