<script setup lang="ts">
export interface ResourcePageProps {
	slug: string;
	type: string;
}

const props = defineProps<ResourcePageProps>();

const { type, slug } = toRefs(props);

const { $directus, $readItems } = useNuxtApp();
const { fullPath } = useRoute();

const { data: resource } = await useAsyncData(
	`${unref(type)}/${unref(slug)}`,
	() => {
		return $directus.request(
			$readItems('resources', {
				filter: {
					type: {
						slug: {
							_eq: unref(type) as string,
						},
					},
					slug: {
						_eq: unref(slug) as string,
					},
				},
				limit: 1,
				fields: [
					'title',
					'category',
					'date_published',
					'summary',
					{
						image: ['id', 'description'],
						author: ['name', 'job_title', 'image'],
						blocks: ['id', 'collection', 'item', 'spacing', 'sort'],
						type: ['title'],
					},
				],
				deep: {
					blocks: {
						_sort: ['sort'],
					} as any /** @TODO type */,
				},
			})
		);
	},
	{
		transform: (data) => data[0],
	}
);

if (!unref(resource)) {
	throw createError({ statusCode: 404, statusMessage: 'resource Not Found' });
}

useHead({
	title: computed(() => unref(resource)?.title ?? null),
});

const publishDate = computed(() => {
	const isoDate = unref(resource)?.date_published;

	if (!isoDate) return null;

	return new Intl.DateTimeFormat('en-US', {
		dateStyle: 'full',
	}).format(new Date(isoDate));
});

const articleUrl = computed(() => `https://directus.io${fullPath}`);

const showFeaturedImage = computed(() => {
	if (unref(type) === 'videos') return false;
	if (!unref(resource)?.image) return false;

	return true;
});
</script>

<template>
	<PageSection v-if="resource" background="pristine-white-lines" class="hero">
		<BaseContainer>
			<BaseButton
				class="back-button"
				:label="`Back to ${resource.type.title}`"
				:href="`/${type}`"
				color="secondary"
				outline
			/>
			<div class="meta">
				<BaseBadge v-if="resource.category" :label="resource.category" />
				<time v-if="resource.date_published" :datetime="resource.date_published">{{ publishDate }}</time>
			</div>
			<div class="title">
				<BaseHeading class="heading" tag="h1" :content="resource.title" />
				<BaseText size="medium" type="subtext" :content="resource.summary" />
			</div>
		</BaseContainer>
	</PageSection>

	<PageSection v-if="resource" background="pristine-white" class="content">
		<BaseContainer>
			<div class="columns">
				<main>
					<BaseMedia v-if="showFeaturedImage">
						<BaseDirectusImage :uuid="resource.image.id" :alt="resource.image.description ?? resource.title" />
					</BaseMedia>
					<BaseBlock v-for="block in resource.blocks" :key="block.id" :type="block.collection" :uuid="block.item" />
				</main>

				<aside>
					<template v-if="resource.author">
						<h3>Posted By</h3>
						<BaseByline
							:name="resource.author.name"
							:title="resource.author.job_title ?? undefined"
							:image="resource.author.image ?? undefined"
						/>

						<h3>Share</h3>
						<div class="share-icons">
							<a :href="`https://www.linkedin.com/sharing/share-offsite/?url={articleUrl}`">
								<img src="~/assets/svg/social/linkedin.svg" alt="LinkedIn Logo" />
							</a>
							<a :href="`https://twitter.com/share?url=${articleUrl}&text=${resource.title}`">
								<img src="~/assets/svg/social/twitter.svg" alt="Twitter Logo" />
							</a>
							<a :href="`http://www.reddit.com/submit?url=${articleUrl}`">
								<img src="~/assets/svg/social/twitter.svg" alt="Reddit Logo" />
							</a>
							<a :href="`https://dev.to/new?prefill=${articleUrl}`">
								<img src="~/assets/svg/social/twitter.svg" alt="Dev.to Logo" />
							</a>
						</div>
					</template>
				</aside>
			</div>
		</BaseContainer>
	</PageSection>
</template>

<style lang="scss" scoped>
.hero {
	padding-block-end: var(--space-5);

	@media (width > 50rem) {
		--nav-offset: var(--space-32);
	}

	@media (width> 60rem) {
		padding-block-end: var(--space-10);
	}

	@media (width > 68rem) {
		--nav-offset: var(--space-10);
	}

	.back-button {
		margin-block-end: var(--space-20);
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
		max-inline-size: 45rem;

		.heading {
			margin-block-end: var(--space-5);
		}
	}
}

.content {
	padding-block-start: var(--space-5);

	@media (width > 60rem) {
		padding-block-start: var(--space-10);
	}

	.columns {
		@media (width > 60rem) {
			display: flex;
			gap: var(--space-5);
			flex-direction: row;
			gap: var(--space-10);
		}

		main {
			max-inline-size: 45rem;
			padding-block-end: var(--space-10);
			border-block-end: 1px solid var(--gray-200);
			margin-block-end: var(--space-10);

			* + * {
				margin-block-start: var(--space-10);
			}

			@media (width > 60rem) {
				flex-grow: 1;
				border: none;
				margin-block-end: 0;
				padding-block-end: 0;
			}
		}

		aside {
			container-type: inline-size;
			order: 2;

			@media (width > 60rem) {
				order: unset;
				flex-basis: var(--space-64);
				padding-inline-start: var(--space-10);
				border-inline-start: 1px solid var(--gray-200);
			}

			h3 {
				margin-block-end: var(--space-5);
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
		}
	}
}
</style>
