<script setup lang="ts">
const { $directus, $readItems, $readSingleton } = useNuxtApp();
const { params } = useRoute();
const router = useRouter();

const { data: feature } = await useAsyncData(
	`features-${params.slug}`,
	() => {
		return $directus.request(
			$readItems('features', {
				filter: {
					slug: {
						_eq: params.slug as string,
					},
				},
				fields: ['id', 'slug', 'title', 'description', 'content', 'module', 'media', 'sort'],
			}),
		);
	},
	{
		transform: (data) => data[0],
	},
);

const { data: allFeatures } = await useAsyncData(
	'features-all',
	() => {
		return $directus.request(
			$readItems('features', {
				fields: ['id', 'slug', 'title', 'sort'],
				sort: 'sort',
			}),
		);
	},
	{
		transform: (data) => data,
	},
);

const { data: footerCta } = useAsyncData('features-footer-cta', () =>
	$directus.request(
		$readSingleton('globals', {
			fields: ['features_page_cta'],
		}),
	),
);

const pagination = computed(() => {
	if (!unref(feature) || !unref(allFeatures)) return {};
	const currentIndex = unref(allFeatures)?.findIndex((f) => f.sort === unref(feature)?.sort);
	const nextIndex = (currentIndex ?? -1) + 1;
	const nextFeature = unref(allFeatures)?.[nextIndex];
	const prevIndex = (currentIndex ?? -1) - 1;
	const prevFeature = unref(allFeatures)?.[prevIndex];
	return {
		next: nextFeature,
		prev: prevFeature,
	};
});

onMounted(() => {
	onKeyStroke('ArrowRight', () => {
		if (unref(pagination).next) {
			router.push(`/features/${unref(pagination).next?.slug}`);
		}
	});

	onKeyStroke('ArrowLeft', () => {
		if (unref(pagination).prev) {
			router.push(`/features/${unref(pagination).prev?.slug}`);
		}
	});
});
</script>

<template>
	<!-- Header -->
	<PageSection>
		<BaseContainer>
			<div class="block-container narrow">
				<BaseButton
					class="back-button"
					label="Back to Features"
					:href="`/features`"
					color="secondary"
					outline
					icon-start="arrow_back"
				/>

				<BaseBadge v-if="feature?.module" class="badge mt-16" caps :label="feature.module" />
				<BaseHeading v-if="feature?.title" align="start" :content="feature.title" size="large" tag="h1" />
				<BaseText
					v-if="feature?.description"
					align="start"
					:content="feature?.description"
					color="foreground"
					type="subtext"
					size="large"
				/>
			</div>
		</BaseContainer>
		<BaseContainer class="content-container mt-16">
			<!-- Sticky Navigation Buttons -->
			<div class="sticky-nav">
				<div class="prev-button">
					<BaseButton
						:href="`/features/${pagination.prev?.slug}`"
						class="button"
						color="primary"
						size="x-large"
						icon="arrow_back"
						:disabled="!pagination.prev"
					/>
				</div>
				<div class="next-button">
					<BaseButton
						:href="`/features/${pagination.next?.slug}`"
						class="button"
						color="primary"
						size="x-large"
						icon="arrow_forward"
						:disabled="!pagination.next"
					/>
				</div>
			</div>
			<div class="block-container narrow">
				<BlockMedia v-if="feature?.media" :uuid="feature?.media as string" />
			</div>
			<div class="block-container narrow mt-16">
				<BaseText v-if="feature?.content" :content="feature?.content" class="text" size="large" color="foreground" />
				<div class="text mt-8 next">
					<span class="subdued">Next:</span>
					<BaseButton
						v-if="pagination?.next"
						:href="`/features/${pagination?.next?.slug}`"
						class="button"
						color="secondary"
						outline
						icon="arrow_forward"
						:label="pagination?.next?.title ?? ''"
					/>
				</div>
			</div>
			<div v-if="footerCta?.features_page_cta" class="block-container narrow mt-16 pb-16">
				<BlockPaper :uuid="footerCta?.features_page_cta as string" />
			</div>
		</BaseContainer>
	</PageSection>
	<!-- Content -->
	<PageSection spacing="none"></PageSection>
</template>

<style lang="scss" scoped>
.text {
	max-inline-size: 45rem;
}

.subdued {
	color: var(--gray-600);
	margin-inline-end: var(--space-2);
}
.block-container {
	container-type: inline-size;
	&.narrow {
		grid-column: narrow;
	}
	> * + * {
		margin-block-start: var(--space-3);
	}
}
.content-container {
	position: relative;
}
.sticky-nav {
	position: sticky;
	top: var(--space-28);
	z-index: 10;
	pointer-events: none;
}
.next-button,
.prev-button {
	position: absolute;
	top: var(--space-28);
	pointer-events: auto;
}
.prev-button {
	left: -8px;
}
.next-button {
	right: -8px;
}
.mt-16 {
	margin-block-start: var(--space-16);
}
.pb-16 {
	padding-block-end: var(--space-16);
}

.mt-8 {
	margin-block-start: var(--space-8);
}
</style>
