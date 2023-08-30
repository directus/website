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
						video: ['url', 'file'],
						related_resources: [
							{
								related_resources_id: [
									'title',
									'category',
									'date_published',
									'image',
									'slug',
									{ author: ['image'], type: ['slug'] },
								],
							},
						],
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

const randIndex = (length: number) => Math.floor(Math.random() * length);

const related = computed(() => {
	const res = unref(resource);

	if (!res || !res.related_resources || res.related_resources.length === 0) return null;

	const length = 4;

	let resources = [];

	if (res.related_resources.length <= length) {
		resources = res.related_resources;
	} else {
		const indexes: number[] = [];

		for (let i = 0; i < length; i++) {
			let rand = randIndex(res.related_resources.length);

			while (indexes.includes(rand)) {
				rand = randIndex(res.related_resources.length);
			}

			indexes.push(rand);
		}

		resources = indexes.map((index) => res.related_resources![index]);
	}

	return resources.map(({ related_resources_id }) => {
		const { image, title, author, type, slug, date_published } = related_resources_id;

		return {
			title,
			image,
			avatar: author?.image,
			description: date_published
				? new Intl.DateTimeFormat('en-US', { dateStyle: 'medium' }).format(new Date(date_published))
				: '',
			href: `/${type.slug}/${slug}`,
		};
	});
});
</script>

<template>
	<PageSection v-if="type === 'videos' && resource?.video" spacing-top="none" class="video">
		<BaseVideo
			class="player"
			:url="resource.video.url ?? undefined"
			:uuid="resource.video.file ?? undefined"
			:controls="true"
		/>
	</PageSection>

	<PageSection v-if="resource" spacing-top="small" background="pristine-white-lines" class="content">
		<BaseContainer>
			<div class="columns">
				<BaseButton
					class="back-button"
					:class="{ absolute: type === 'videos' }"
					label="Back"
					:href="`/${type}`"
					color="secondary"
					outline
					icon-start="arrow_back"
				/>

				<div class="header">
					<div class="meta">
						<BaseBadge v-if="resource.category" :label="resource.category" />
						<time v-if="resource.date_published" :datetime="resource.date_published">{{ publishDate }}</time>
					</div>

					<div class="title">
						<BaseHeading class="heading" tag="h1" :content="resource.title" />
						<BaseText size="medium" type="subtext" :content="resource.summary" />
					</div>
				</div>

				<main>
					<BaseMedia v-if="showFeaturedImage">
						<BaseDirectusImage
							:width="720"
							:height="405"
							:uuid="resource.image.id"
							:alt="resource.image.description ?? resource.title"
						/>
					</BaseMedia>
					<BaseBlock v-for="block in resource.blocks" :key="block.id" :type="block.collection" :uuid="block.item" />
				</main>

				<aside>
					<div class="meta">
						<template v-if="resource.author">
							<h3>Posted By</h3>
							<BaseByline
								:name="resource.author.name"
								:title="resource.author.job_title ?? undefined"
								:image="resource.author.image ?? undefined"
							/>
						</template>

						<h3>Share</h3>
						<div class="share-icons">
							<a :href="`https://www.linkedin.com/sharing/share-offsite/?url=${articleUrl}`">
								<img src="~/assets/svg/social/linkedin.svg" alt="LinkedIn Logo" />
							</a>
							<a :href="`https://x.com/share?url=${articleUrl}&text=${resource.title}`">
								<img src="~/assets/svg/social/x.svg" alt="Twitter Logo" />
							</a>
							<a :href="`http://www.reddit.com/submit?url=${articleUrl}`">
								<img src="~/assets/svg/social/reddit.svg" alt="Reddit Logo" />
							</a>
							<a :href="`https://dev.to/new?prefill=${articleUrl}`">
								<img src="~/assets/svg/social/dev-to.svg" alt="Dev.to Logo" />
							</a>
						</div>

						<template v-if="related">
							<h3>Related</h3>
							<BaseCard
								v-for="card in related"
								:key="card.title"
								class="related"
								:title="card.title"
								:image="card.image ?? undefined"
								media-style="none"
								:description="card.description ?? undefined"
								:description-avatar="card.avatar ?? undefined"
								layout="horizontal"
								:to="card.href"
							/>
						</template>
					</div>
				</aside>
			</div>
		</BaseContainer>
	</PageSection>
</template>

<style lang="scss" scoped>
.video {
	padding-block-end: 0;
	background-color: var(--black);

	.player {
		max-block-size: calc(90vh - var(--space-60));
		aspect-ratio: 16/9;
		width: auto;
		margin-inline: auto;
	}
}

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
			}

			&.absolute {
				position: absolute;
				inset-inline-end: 0;
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

			* + * {
				margin-block-start: var(--space-10);
			}

			@media (width > 60rem) {
				border: none;
				margin-block-end: 0;
				padding-block-end: 0;
				grid-column: 1;

				:deep(.base-text) {
					--font-size: var(--font-size-lg);
					--line-height: var(--line-height-2xl);
					--font-weight: 400;
				}
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
			grid-template-columns: 1fr var(--space-72);
			gap: 0 var(--space-10);
		}

		@media (width > 70rem) {
			grid-template-columns: auto 1fr var(--space-72);
		}
	}
}
</style>
