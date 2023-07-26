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
</script>

<template>
	<BaseContainer class="header-container">
		<header>
			<NuxtLink to="/" class="logo">
				<img src="~/assets/svg/logo-dark.svg" alt="Directus Logo" />
			</NuxtLink>

			<button><BaseIcon name="menu" /></button>

			<nav v-if="menu">
				<ul>
					<li v-for="section in menu.items" :key="section.id">
						<NuxtLink v-if="section.url || section.page?.permalink" class="section-title">{{ section.title }}</NuxtLink>
						<button v-else class="section-title">{{ section.title }}</button>
						<ul v-if="section.children && section.children.length > 0">
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
	background-color: rgba(255, 255, 255, 0.8);
	z-index: 5;
	backdrop-filter: blur(10px);
	padding-block: var(--space-4);
}

.logo {
	height: var(--space-6);
}
</style>
