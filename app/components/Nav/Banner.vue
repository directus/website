<script setup lang="ts">
const { $directus, $readItems, $posthog } = useNuxtApp();
const route = useRoute();

const now = new Date().toISOString();

const { data: banners } = await useAsyncData('site-banners', () =>
	$directus.request(
		$readItems('site_banners', {
			fields: ['id', 'icon', 'content', 'link', 'include_paths', 'exclude_paths'],
			filter: {
				status: { _eq: 'published' },
				_and: [
					{
						_or: [{ date_start: { _null: true } }, { date_start: { _lte: now } }],
					},
					{
						_or: [{ date_end: { _null: true } }, { date_end: { _gte: now } }],
					},
				],
			},
			sort: ['sort'],
		}),
	),
);

const dismissedBanners = useCookie('directus-dismissed-banners', {
	default: () => [] as string[],
});

const sessionBannerId = useState<string | null>('banner-session-id', () => null);

function matchPath(pattern: string, path: string): boolean {
	const escaped = pattern.replace(/[.+?^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '.*');
	return new RegExp('^' + escaped + '$').test(path);
}

function bannerMatchesRoute(banner: { include_paths: string[] | null; exclude_paths: string[] | null }, path: string) {
	if (banner.include_paths?.length && !banner.include_paths.some((p) => matchPath(p, path))) return false;
	if (banner.exclude_paths?.length && banner.exclude_paths.some((p) => matchPath(p, path))) return false;
	return true;
}

const eligibleBanners = computed(() => {
	if (!unref(banners)?.length) return [];

	return unref(banners)!.filter((b) => {
		if (unref(dismissedBanners).includes(b.id)) return false;
		if (!bannerMatchesRoute(b, route.path)) return false;
		return true;
	});
});

const banner = computed(() => {
	const eligible = unref(eligibleBanners);
	if (!eligible.length) return null;

	const targeted = eligible.filter((b) => b.include_paths?.length);
	const pool = targeted.length ? targeted : eligible;

	const storedId = unref(sessionBannerId);

	if (storedId) {
		const stored = pool.find((b) => b.id === storedId);
		if (stored) return stored;
	}

	const pick = pool[Math.floor(Math.random() * pool.length)];
	sessionBannerId.value = pick.id;
	return pick;
});

const dismiss = (id: string) => {
	dismissedBanners.value = [...unref(dismissedBanners), id];
};

if (import.meta.client) {
	watch(
		banner,
		(b) => {
			if (!b || !$posthog) return;

			$posthog.capture('banner_impression', {
				banner_id: b.id,
				banner_content: b.content,
				banner_link: b.link,
			});
		},
		{ immediate: true },
	);
}
</script>

<template>
	<BaseContainer v-if="banner" class="banner-container">
		<div class="banner-content">
			<NuxtLink
				v-capture="{ name: 'banner_click', properties: { banner_id: banner.id, banner_link: banner.link } }"
				class="link"
				:href="banner.link ?? undefined"
			>
				<BaseIcon v-if="banner.icon" class="icon" :name="banner.icon" size="small" />
				<Transition name="banner-fade" mode="out-in">
					<!-- eslint-disable-next-line vue/no-v-html -->
					<span v-links :key="banner.id" class="content" v-html="banner.content" />
				</Transition>
				<BaseIcon class="arrow" name="arrow_forward" size="small" />
			</NuxtLink>

			<button class="dismiss" aria-label="Close" @click="dismiss(banner.id)">
				<BaseIcon name="close" size="small" />
			</button>
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

.banner-fade-enter-active,
.banner-fade-leave-active {
	transition: opacity var(--duration-150) var(--ease-out);
}

.banner-fade-enter-from,
.banner-fade-leave-to {
	opacity: 0;
}
</style>
