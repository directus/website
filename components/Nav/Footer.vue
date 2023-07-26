<script setup lang="ts">
import type { Query } from '@directus/sdk';
import type { Navigation, Schema } from '~/types/schema';

const { $directus, $readItem } = useNuxtApp();

const menuRequest: Query<Schema, Navigation> = {
	fields: [
		{
			items: [
				'id',
				'title',
				'url',
				'page',
				{
					children: ['id', 'title', 'url', 'page'],
				},
			],
		},
	],
};

const { data: navPrimary } = useAsyncData(() => $directus.request($readItem('navigation', 'footer', menuRequest)));

const { data: navSecondary } = useAsyncData(() =>
	$directus.request($readItem('navigation', 'footer-secondary', menuRequest))
);

const year = new Date().getFullYear();

const socials = {
	discord: 'https://directus.chat',
	docker: 'https://hub.docker.com/r/directus/directus',
	twitter: 'https://twitter.com/directus',
	github: 'https://github.com/directus',
	youtube: 'https://www.youtube.com/c/DirectusVideos',
	linkedin: 'https://www.linkedin.com/company/directus-io',
	npm: 'https://www.npmjs.com/package/directus',
};
</script>

<template>
	<BaseContainer class="footer-container">
		<footer class="footer">
			<nav v-if="navPrimary" class="primary">
				<ul>
					<NuxtLink to="/" class="logo">
						<img src="~/assets/svg/logo-light.svg" alt="Directus Logo (Light)" />
					</NuxtLink>

					<li v-for="group of navPrimary.items" :key="group.id">
						<div class="group-title">{{ group.title }}</div>

						<ul class="children">
							<li v-for="child in group.children" :key="child.id">
								<NuxtLink :href="child.url ?? undefined">{{ child.title }}</NuxtLink>
							</li>
						</ul>
					</li>
				</ul>
			</nav>

			<BaseDivider />

			<nav class="secondary">
				<small>&copy;{{ year }} Monospace Inc</small>

				<ul v-if="navSecondary" class="links">
					<li v-for="item in navSecondary.items" :key="item.id">
						<NuxtLink :href="item.url ?? undefined">{{ item.title }}</NuxtLink>
					</li>
				</ul>

				<ul class="socials">
					<li v-for="[service, link] in Object.entries(socials)" :key="service">
						<NuxtLink :href="link">
							<img :src="dynamicAsset(`/svg/social/${service}.svg`)" :alt="service" />
						</NuxtLink>
					</li>
				</ul>
			</nav>
		</footer>
	</BaseContainer>
</template>

<style scoped lang="scss">
.footer-container {
	color: var(--white);
	background-color: var(--gray-800);
	padding-block: var(--space-10);

	@media (width > 50rem) {
		padding-block-start: var(--space-32);
		padding-block-end: var(--space-11);
	}

	:deep(.base-divider) {
		--base-divider-color: var(--gray-700);
	}
}

.footer {
	ul {
		list-style: none;
		margin: 0;
		padding: 0;
	}

	a {
		color: var(--gray-400);
		text-decoration: none;
		font-size: var(--font-size-sm);
		line-height: var(--line-height-sm);

		&:hover {
			color: var(--white);
			text-decoration: underline;
		}
	}

	.primary > ul {
		--columns: 1;
		--column-size: 1fr;

		display: grid;
		row-gap: var(--space-6);
		grid-template-columns: repeat(var(--columns), var(--column-size));

		@media (width > 25rem) {
			--columns: 2;
		}

		@media (width > 50rem) {
			--columns: 4;
		}

		@media (width > 75rem) {
			--columns: 5;
			row-gap: 0;
		}
	}

	.logo {
		max-width: var(--space-40);

		@media (width > 25rem) {
			grid-column: 1 / span 2;
		}

		@media (width > 50rem) {
			grid-column: 1 / span 4;
		}

		@media (width > 75rem) {
			grid-column: 1;
		}
	}

	.group-title {
		margin-block-end: var(--space-1);

		@media (width > 50rem) {
			margin-block-end: var(--space-3);
		}

		@media (width > 75rem) {
			margin-block-end: var(--space-5);
		}
	}

	.children {
		li + li {
			margin-block-start: var(--space-1);
		}

		@media (width > 75rem) {
			li + li {
				margin-block-start: var(--space-2);
			}
		}
	}

	.base-divider {
		margin-block: var(--space-6);

		@media (width > 50rem) {
			margin-block-start: var(--space-20);
			margin-block-end: var(--space-11);
		}
	}

	.secondary,
	.secondary a {
		color: var(--gray-500);
	}

	.secondary a:hover {
		color: var(--white);
	}

	.secondary {
		@media (width > 60rem) {
			display: flex;
			align-items: center;
			gap: var(--space-10);
		}

		.links {
			margin-block: var(--space-3);

			@media (width > 25rem) {
				display: flex;
				gap: var(--space-4);
				margin-block: var(--space-6);
			}

			@media (width > 60rem) {
				margin-block: 0;
				gap: var(--space-10);
			}
		}

		.socials {
			display: flex;
			gap: var(--space-4);
			flex-wrap: wrap;
			align-items: center;

			img {
				width: var(--space-6);
				height: auto;
			}

			@media (width > 60rem) {
				margin-inline-start: auto;
				gap: var(--space-10);
			}
		}
	}
}
</style>
