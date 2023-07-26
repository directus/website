<script setup lang="ts">
const { $directus, $readItem } = useNuxtApp();

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
							children: [
								'id',
								'title',
								'url',
								{
									page: ['permalink'],
									image: ['id'],
								},
							],
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

const navActive = ref(false);
const navActiveSection = ref<string>();

const toggleActiveSection = (id: string) => {
	if (unref(navActiveSection) === id) {
		navActiveSection.value = undefined;
	} else {
		navActiveSection.value = id;
	}
};
</script>

<template>
	<BaseContainer class="header-container">
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
						<NuxtLink v-if="section.url || section.page?.permalink" class="section-title">{{ section.title }}</NuxtLink>

						<button
							v-else
							class="section-title"
							:class="{ active: navActiveSection === section.id }"
							@click="toggleActiveSection(section.id)"
						>
							{{ section.title }}
						</button>

						<ul
							v-if="section.children && section.children.length > 0"
							class="submenu"
							:class="{ active: navActiveSection === section.id }"
						>
							<li v-for="link in section.children" :key="link.id">
								<NuxtLink :href="link.url ?? undefined" :to="link.page?.permalink">
									{{ link.title }}
								</NuxtLink>
							</li>
						</ul>
					</li>
				</ul>
			</nav>
		</header>
	</BaseContainer>
</template>

<style lang="scss" scoped>
.header-container {
	position: sticky;
	top: 0;
	z-index: 5;
	background-color: rgba(255, 255, 255, 0.8);
	padding-block: var(--space-4);
	backdrop-filter: blur(10px);
}

.header {
	display: flex;
	flex-wrap: wrap;
	align-items: center;
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

	&.active {
		display: block;
	}
}

.submenu {
	display: none;

	&.active {
		display: block;
	}
}
</style>
