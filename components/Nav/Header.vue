<script setup lang="ts">
const { $directus, $readItem, $readSingleton } = useNuxtApp();

const { data: menu } = useAsyncData('header-nav', () =>
	$directus.request(
		$readItem('navigation', 'header', {
			fields: [
				{
					items: [
						'id',
						'title',
						'url',
						{
							page: ['permalink'],
							children: ['id', 'title', 'url', 'description', 'image', { page: ['permalink'] }],
						},
					],
				},
			],
			deep: {
				items: {
					_sort: ['sort'],
				},
			},
		})
	)
);

const { data: ctas } = useAsyncData('header-nav-ctas', () =>
	$directus.request(
		$readSingleton('globals', {
			fields: ['header_cta_buttons'],
		})
	)
);

const headerContainer = ref();

const navActive = ref(false);
const navActiveSection = ref<string | null>(null);

const toggleActiveSection = (id: string) => {
	if (unref(navActiveSection) === id) {
		navActiveSection.value = null;
	} else {
		navActiveSection.value = id;
	}
};

const route = useRoute();

const resetNavState = () => {
	navActive.value = false;
	navActiveSection.value = null;
};

watch(route, resetNavState);
onClickOutside(headerContainer, resetNavState);

/**
 * @TODO
 *
 * Fix `as any` typings in template once SDK bug is resolved
 */
</script>

<template>
	<BaseContainer ref="headerContainer" class="header-container">
		<ClientOnly>
			<NavBanner />
		</ClientOnly>

		<header class="header">
			<NuxtLink to="/" class="logo">
				<img src="~/assets/svg/logo-dark.svg" alt="Directus Logo" />
			</NuxtLink>

			<button class="menu-toggle" :class="{ active: navActive }" @click="navActive = !navActive">
				<BaseIcon name="menu" />
			</button>

			<nav v-if="menu" :class="{ active: navActive }" class="menu">
				<ul>
					<li v-for="section in menu.items" :key="section.id">
						<NuxtLink
							v-if="section.url || (section.page as any)?.permalink"
							:href="section.url ?? undefined"
							:to="(section.page as any)?.permalink"
							class="section-title"
						>
							{{ section.title }}
						</NuxtLink>

						<button
							v-else
							class="section-title"
							:class="{ active: navActiveSection === section.id }"
							@click="toggleActiveSection(section.id)"
						>
							<span class="text">{{ section.title }}</span>

							<BaseIcon class="icon" name="expand_more" size="small" />
						</button>

						<ul
							v-if="section.children && section.children.length > 0"
							class="submenu"
							:class="{ active: navActiveSection === section.id }"
						>
							<li v-for="link in section.children" :key="link.id">
								<NuxtLink :href="link.url ?? undefined" :to="(link.page as any)?.permalink" class="link">
									<BaseDirectusImage if="link.image" :uuid="(link.image as string)" alt="" class="icon" lazy />
									<div class="content">
										<div class="title">{{ link.title }}</div>
										<div v-if="link.description" class="description">{{ link.description }}</div>
									</div>
								</NuxtLink>
							</li>
						</ul>
					</li>
				</ul>
			</nav>

			<BlockButtonGroup
				v-if="ctas && ctas.header_cta_buttons"
				class="ctas"
				:class="{ active: navActive }"
				:uuid="ctas.header_cta_buttons"
			/>

			<NuxtLink class="star" :class="{ active: navActive }" href="https://github.com/directus/directus">
				<BaseIcon class="icon" name="star" size="x-small" />
				<span class="label">Star us on GitHub</span>
			</NuxtLink>
		</header>
	</BaseContainer>
</template>

<style lang="scss" scoped>
ul {
	list-style: none;
	margin: 0;
	padding: 0;
}

a {
	text-decoration: none;
	color: inherit;

	&:hover {
		text-decoration: underline;
	}
}

.base-container.header-container {
	position: fixed;
	top: 0;
	z-index: 5;
	background-color: rgba(255, 255, 255, 0.8);
	backdrop-filter: blur(10px);
	max-height: 100vh;
	overflow: auto;
	width: 100%;
}

.header {
	display: flex;
	flex-wrap: wrap;
	align-items: center;
	padding-block: var(--space-3);
}

.logo {
	display: block;

	img {
		height: var(--space-8);
	}
}

.menu-toggle {
	margin-inline-start: auto;
}

.menu {
	flex-basis: 100%;
	display: none;
	font-size: var(--font-size-lg);
	line-height: var(--line-height-lg);
	margin-block-start: var(--space-4);

	&.active {
		display: block;
	}
}

.section-title {
	padding-block: var(--space-3);
	border-top: 1px solid var(--black);
	width: 100%;
	line-height: inherit;
	display: flex;
	align-items: center;
	justify-content: space-between;
}

.submenu {
	display: none;
	margin-block-end: var(--space-3);

	&.active {
		display: block;
	}

	li + li {
		margin-block-start: var(--space-4);
	}

	.link {
		display: flex;
		gap: var(--space-3);
		align-items: flex-start;
	}

	.icon {
		width: var(--space-8);
	}

	.title {
		font-size: var(--font-size-base);
		line-height: var(--line-height-base);
	}

	.description {
		color: var(--gray-600);
		font-size: var(--font-size-sm);
		line-height: var(--line-height-sm);
	}
}

.ctas {
	flex-basis: 100%;
	display: none;
	margin-inline: auto;
	margin-block: var(--space-3);
	justify-content: center;

	&.active {
		display: flex;
	}
}

.star {
	display: none;
	color: var(--gray-400);
	text-align: center;
	width: 100%;
	font-size: var(--font-size-sm);
	line-height: var(--line-height-sm);
	font-weight: 600;

	.icon {
		--base-icon-color: var(--gray-400);

		margin-inline-end: var(--space-05);
		vertical-align: -3px;
	}

	&.active {
		display: block;
	}

	&:hover {
		text-decoration: none;
		color: var(--black);

		.icon {
			--base-icon-color: var(--black);
		}

		.label {
			text-decoration: underline;
		}
	}
}

@media (width > 50rem) {
	.logo {
		order: 1;
	}

	.star {
		order: 2;
		margin-inline-start: auto;
		width: auto;
		display: block;
		font-size: var(--font-size-xs);
		line-height: var(--line-height-xs);
	}

	.ctas {
		display: block;
		order: 3;
		margin-block: 0;
		flex-basis: unset;
		margin-inline: var(--space-3);
		container-type: unset;
	}

	.menu-toggle {
		order: 4;
		margin-inline: 0;
	}

	.menu {
		order: 5;
	}
}

@media (width > 80rem) {
	.base-container.header-container {
		position: sticky;
		top: 0;
		overflow: visible;
	}

	.header {
		flex-wrap: nowrap;
	}

	.star {
		margin-inline-end: var(--space-3);
	}

	.ctas {
		order: 3;
		margin-inline: 0;
	}

	.menu-toggle {
		display: none;
	}

	.menu {
		order: 2;
		flex-basis: content;
		display: block;
		padding: 0;
		font-size: var(--font-size-sm);
		line-height: var(--line-height-sm);
		margin-inline: var(--space-8);
		margin-block: 0;

		> ul {
			display: flex;
			align-items: center;
			gap: var(--space-8);
		}

		a {
			text-underline-offset: var(--space-05);
		}
	}

	.section-title {
		padding: 0;
		border: none;
		width: auto;
		justify-content: flex-start;
		cursor: pointer;
		font-weight: 500;

		&.active .text {
			text-decoration: underline;
			text-underline-offset: var(--space-05);
		}
	}

	.submenu {
		position: absolute;
		inset-block-start: calc(100% + var(--space-4));
		inset-inline-start: 50%;
		translate: -50% 0;
		background-color: var(--white);
		border-radius: var(--rounded-md);
		padding: var(--space-6) var(--space-8);
		width: 67.5rem;
		box-shadow: var(--shadow-base);
		grid-template-columns: repeat(3, 1fr);
		gap: var(--space-2) var(--space-4);

		&.active {
			display: grid;
		}
	}
}
</style>
