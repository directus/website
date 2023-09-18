<script setup lang="ts">
const { $directus, $readItems } = useNuxtApp();

const { data: banner } = useAsyncData(
	'site-banner',
	async () =>
		$directus.request(
			$readItems('site_banners', {
				fields: ['id', 'icon', 'content', 'link'],
				sort: ['-date_created'],
				limit: 1,
			})
		),
	{ transform: (data) => data[0] }
);

const dismissedBanners = useLocalStorage('directus-dismissed-banners', [] as string[]);

const bannerVisible = computed(() => {
	if (!unref(banner)) return false;
	return unref(dismissedBanners).includes(unref(banner)!.id) === false;
});

const dismiss = (id: string) => {
	dismissedBanners.value = [...unref(dismissedBanners), id];
};
</script>

<template>
	<BaseContainer v-if="banner && bannerVisible" class="banner-container">
		<div class="banner-content">
			<NuxtLink class="link" :href="banner.link ?? undefined">
				<BaseIcon v-if="banner.icon" class="icon" :name="banner.icon" size="small" />
				<!-- eslint-disable-next-line vue/no-v-html -->
				<span v-links class="content" v-html="banner.content" />
				<BaseIcon class="arrow" name="arrow_forward" size="small" />
			</NuxtLink>

			<button class="dismiss" @click="dismiss(banner.id)"><BaseIcon name="close" size="small" /></button>
		</div>
	</BaseContainer>
</template>

<style scoped lang="scss">
.base-container.banner-container {
	background: var(--foreground);
	cursor: pointer;
	grid-column: full;
	height: var(--space-8);
}

.banner-content {
	height: 100%;
	display: flex;
	align-items: center;

	.base-icon {
		--base-icon-color: var(--background);
	}
}

.link {
	flex-grow: 1;
	height: 100%;
	display: flex;
	align-items: center;
	color: var(--background);
	text-decoration: none;
	font-size: var(--font-size-xs);
	line-height: var(--line-height-xs);
	font-weight: 600;

	.icon {
		margin-inline-end: var(--space-2);
	}

	.content {
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.arrow {
		display: none;
		transition: translate var(--duration-150) var(--ease-out);
		margin-inline-start: var(--space-1);

		@media (width > 50rem) {
			display: block;
		}
	}

	&:hover .arrow {
		translate: var(--space-1) 0;
	}
}
</style>
