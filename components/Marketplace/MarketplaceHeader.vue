<script setup lang="ts">
const { height: headerHeight } = useHeaderHeight();

const navigation = [
	{
		label: 'Extensions',
		href: '/extensions',
	},
	{
		label: 'Integrations',
		href: '/integrations',
	},
	{
		label: 'Templates',
		href: '/templates',
	},
];
</script>

<template>
	<BaseContainer class="marketplace-header" :style="{ marginTop: headerHeight + 'px' }">
		<nav class="marketplace-header-content">
			<BaseDirectusImage uuid="ee77ef38-ce80-4404-8966-0c26e5a956ac.svg" :height="32" alt="Directus Marketplace" />
			<div class="title">Marketplace</div>
			<ol>
				<li v-for="{ href, label } in navigation" :key="href">
					<NuxtLink :to="href" class="link">{{ label }}</NuxtLink>
				</li>
			</ol>
		</nav>
	</BaseContainer>
</template>

<style scoped lang="scss">
.marketplace-header {
	background: linear-gradient(to bottom, #fe97dc15, #745eff15);
	border-block-end: 1px solid #745eff15;
	padding-block: var(--space-1);

	// Remove margin-top on larger screens where header becomes sticky
	@media (width > 68rem) {
		margin-top: 0 !important;
	}
}

.marketplace-header-content {
	display: flex;
	align-items: center;
	gap: var(--space-4);
	font-size: var(--font-size-sm);
	line-height: var(--line-height-sm);

	@container (width > 35rem) {
		font-size: var(--font-size-base);
		line-height: var(--line-height-base);
	}

	img {
		block-size: var(--space-8);
		width: auto;

		@container (width > 35rem) {
			block-size: var(--space-10);
		}
	}

	.title {
		font-size: var(--font-size-base);
		line-height: var(--line-height-base);
		color: var(--primary);
		font-weight: 600;
		margin-inline-start: var(--space-2);
	}

	ol {
		margin-inline-start: auto;
		list-style: none;
		padding: 0;
		display: flex;
		gap: var(--space-4);

		@container (width > 35rem) {
			gap: var(--space-10);
		}

		a {
			color: var(--gray-400);
			transition: color var(--duration-150) var(--ease-out);
			text-decoration: none;

			&:hover {
				color: var(--foreground);
				transition: none;
			}
		}

		li:first-child a {
			color: var(--foreground);
		}
	}
}
</style>
