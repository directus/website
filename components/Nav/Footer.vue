<script setup lang="ts">
import type { Query } from '@directus/sdk';
import type { Navigation, Schema } from '~/types/schema';

const { $directus, $readItem, $readSingleton } = useNuxtApp();

const menuRequest: Query<Schema, Navigation> = {
	fields: [
		{
			items: [
				'id',
				'title',
				'url',
				'page',
				{
					page: ['permalink'],
					children: ['id', 'title', 'url', { page: ['permalink'] }],
				},
			],
		},
	],
};

const { data: navPrimary } = useAsyncData('footer-primary', () =>
	$directus.request($readItem('navigation', 'footer', menuRequest))
);

const { data: navSecondary } = useAsyncData('footer-secondary', () =>
	$directus.request($readItem('navigation', 'footer-secondary', menuRequest))
);

const { data: globals } = useAsyncData('footer-description', () =>
	$directus.request($readSingleton('globals', { fields: ['description'] }))
);

const year = new Date().getFullYear();

const socials = {
	github: 'https://github.com/directus',
	discord: 'https://directus.chat',
	youtube: 'https://www.youtube.com/c/DirectusVideos',
	docker: 'https://hub.docker.com/r/directus/directus',
	npm: 'https://www.npmjs.com/package/directus',
	x: 'https://x.com/directus',
	mastodon: 'https://mastodon.social/@directus',
	linkedin: 'https://www.linkedin.com/company/directus-io',
};
</script>

<template>
	<BaseContainer class="footer-container">
		<footer class="footer">
			<nav v-if="navPrimary" class="primary">
				<ul>
					<li class="logo">
						<NuxtLink to="/">
							<img src="~/assets/svg/logo-dark.svg" alt="Directus Logo" />
						</NuxtLink>

						<!-- eslint-disable-next-line vue/no-v-html -->
						<div v-if="globals" class="description" v-html="globals.description" />
					</li>

					<li v-for="group of navPrimary.items" :key="group.id">
						<div class="group-title">{{ group.title }}</div>

						<ul class="children">
							<li v-for="child in group.children" :key="child.id">
								<NuxtLink :href="(child.page as any)?.permalink ?? child.url ?? undefined">{{ child.title }}</NuxtLink>
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
						<NuxtLink :href="(item.page as any)?.permalink ?? item.url ?? undefined">{{ item.title }}</NuxtLink>
					</li>
				</ul>

				<ul class="socials">
					<li v-for="[service, link] in Object.entries(socials)" :key="service">
						<NuxtLink :href="link" target="_blank">
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
	padding-block: var(--space-10);
	padding-block-end: var(--space-5);

	:deep(.base-divider) {
		--base-divider-color: var(--gray-200);
	}

	.page-section.bg-pristine-white + &,
	.page-section.bg-pristine-white-lines + & {
		border-top: 1px solid var(--gray-200);
	}
}

.footer {
	font-size: var(--font-size-sm);
	line-height: var(--line-height-sm);

	small {
		font-size: var(--font-size-sm);
		line-height: var(--line-height-sm);
	}

	ul {
		list-style: none;
		margin: 0;
		padding: 0;
	}

	a {
		color: var(--gray-400);
		text-decoration: none;
		transition: color var(--duration-150) var(--ease-out);

		&:hover {
			transition: none;
			color: var(--foreground);
			text-decoration: underline;
		}
	}

	.primary > ul {
		--columns: 1;
		--column-size: 1fr;

		display: grid;
		row-gap: var(--space-9);
		grid-template-columns: repeat(var(--columns), var(--column-size));

		@media (width > 25rem) {
			--columns: 2;
		}

		@media (width > 50rem) {
			--columns: 4;
		}

		@media (width > 75rem) {
			--columns: 6;
			column-gap: var(--space-10);
			row-gap: 0;
		}
	}

	.logo {
		img {
			max-height: var(--space-9);
			margin-block-end: var(--space-2);
		}

		.description {
			color: var(--gray-400);
		}

		@media (width > 25rem) {
			grid-column: 1 / span 2;
		}

		@media (width > 50rem) {
			grid-column: 1 / span 4;
		}

		@media (width > 75rem) {
			grid-column: 1 / span 2;
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
		margin-block: var(--space-5);

		@media (width > 50rem) {
			margin-block-start: var(--space-20);
			margin-block-end: var(--space-5);
		}
	}

	.secondary {
		color: var(--gray-400);

		@media (width > 60rem) {
			display: flex;
			align-items: center;
			gap: var(--space-8);
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
				gap: var(--space-8);
			}
		}

		.socials {
			display: flex;
			gap: var(--space-6);
			flex-wrap: wrap;
			align-items: center;
			justify-content: space-between;

			img {
				width: var(--space-5);
				height: auto;
				filter: brightness(1);
				transition: filter var(--duration-150) var(--ease-out);

				@media (width > 35rem) {
					width: var(--space-6);
				}

				&:hover {
					transition: none;
					filter: brightness(0);
				}
			}

			@media (width > 35rem) {
				justify-content: flex-start;
			}

			@media (width > 60rem) {
				margin-inline-start: auto;
				gap: var(--space-8);
			}
		}
	}
}
</style>
