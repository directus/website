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
		<NuxtLink class="banner" :href="banner.link ?? undefined">
			<BaseIcon v-if="banner.icon" :name="banner.icon" size="small" />
			<!-- eslint-disable-next-line vue/no-v-html -->
			<span class="content" v-html="banner.content" />
			<BaseIcon class="arrow" name="arrow_forward" size="small" />
			<button class="dismiss" @click="dismiss(banner.id)"><BaseIcon name="close" size="small" /></button>
		</NuxtLink>
	</BaseContainer>
</template>

<style scoped lang="scss">
.base-container.banner-container {
	background: linear-gradient(88deg, var(--purple-300) 0%, var(--pink-200) 100%);
	padding-block: var(--space-1);
	cursor: pointer;
	grid-column: full;
}

.banner {
	display: flex;
	align-items: center;
	gap: var(--space-2);
	color: var(--white);
	text-decoration: none;
	font-size: var(--font-size-xs);
	line-height: var(--line-height-xs);

	.content {
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	&:hover .content {
		text-decoration: underline;
	}

	.base-icon {
		--base-icon-color: var(--white);
	}

	.arrow {
		display: none;

		@media (width > 50rem) {
			display: block;
		}
	}

	.dismiss {
		margin-inline-start: auto;
	}
}
</style>
