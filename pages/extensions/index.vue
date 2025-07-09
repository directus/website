<script setup lang="ts">
import type { MarketplaceResponse } from '~/types/marketplace';

// Page metadata
useHead({
	title: 'Extensions - Directus Marketplace',
});

useServerSeoMeta({
	title: 'Extensions - Directus Marketplace',
	description:
		'Give your Directus instance superpowers. Discover extensions for endpoints, operations, interfaces, bundles, and more.',
	ogTitle: 'Extensions - Directus Marketplace',
	ogDescription:
		'Give your Directus instance superpowers. Discover extensions for endpoints, operations, interfaces, bundles, and more.',
});

// Reactive state
const searchQuery = ref('');
const selectedType = ref('');
const currentPage = ref(1);

// Fetch extensions data
const { data: extensionsResponse, pending } = await useFetch<MarketplaceResponse>('/api/extensions', {
	query: {
		search: searchQuery,
		type: selectedType,
		page: currentPage,
		limit: 20,
	},
	default: () => ({ data: [], meta: { total_count: 0, filter_count: 0 } }),
});

// Available filter types
const filterTypes = [
	{ value: '', label: 'All Types' },
	{ value: 'endpoint', label: 'Endpoint' },
	{ value: 'operation', label: 'Operation' },
	{ value: 'bundle', label: 'Bundle' },
	{ value: 'interface', label: 'Interface' },
	{ value: 'display', label: 'Display' },
	{ value: 'layout', label: 'Layout' },
	{ value: 'module', label: 'Module' },
	{ value: 'panel', label: 'Panel' },
	{ value: 'hook', label: 'Hook' },
];

// Clear filters
const clearFilters = () => {
	searchQuery.value = '';
	selectedType.value = '';
	currentPage.value = 1;
};

// Format download count
const formatDownloads = (count: number): string => {
	if (count >= 1000) {
		return `${(count / 1000).toFixed(1)}k`;
	}

	return count.toString();
};

definePageMeta({
	layout: 'marketplace',
});
</script>

<template>
	<div>
		<!-- Hero Section -->
		<BaseContainer spacing="x-large">
			<div class="hero-section">
				<div class="hero-content">
					<h1 class="hero-title">Give your Directus instance superpowers</h1>
					<p class="hero-description">Directus supports many of the services you use out of the box</p>
					<BaseButton color="primary" label="Build Your Own" href="/docs/extensions" class="hero-cta" />
				</div>
				<div class="hero-media">
					<div class="hero-placeholder">
						<span>Video? Image?</span>
					</div>
				</div>
			</div>
		</BaseContainer>

		<!-- Search and Filters -->
		<BaseContainer spacing="large">
			<div class="filters-section">
				<div class="search-container">
					<BaseInput v-model="searchQuery" placeholder="Search" prepend-icon="search" class="search-input" />
				</div>

				<div class="filters-container">
					<div class="filter-group">
						<h3 class="filter-title">TYPE</h3>
						<div class="filter-options">
							<label v-for="type in filterTypes" :key="type.value" class="filter-option">
								<input v-model="selectedType" type="radio" :value="type.value" class="filter-radio" />
								<span class="filter-label">{{ type.label }}</span>
							</label>
						</div>
					</div>
				</div>
			</div>
		</BaseContainer>

		<!-- Extensions Grid -->
		<BaseContainer spacing="medium">
			<div v-if="pending" class="loading-state">
				<p>Loading extensions...</p>
			</div>

			<div v-else-if="extensionsResponse?.data.length === 0" class="empty-state">
				<p>No extensions found.</p>
				<BaseButton v-if="searchQuery || selectedType" @click="clearFilters" color="secondary" label="Clear Filters" />
			</div>

			<div v-else class="extensions-grid">
				<div v-for="extension in extensionsResponse?.data" :key="extension.id" class="extension-card">
					<NuxtLink :to="`/extensions/${extension.name}`" class="extension-link">
						<div class="extension-thumbnail">
							<img
								v-if="extension.featured_image"
								:src="extension.featured_image"
								:alt="extension.name"
								class="extension-image"
							/>
							<div v-else class="extension-placeholder">
								<span>Thumbnail</span>
							</div>
						</div>

						<div class="extension-content">
							<h3 class="extension-title">{{ extension.name }}</h3>
							<p class="extension-description">{{ extension.description }}</p>

							<div class="extension-meta">
								<span class="extension-type">{{ extension.type }}</span>
								<span class="extension-downloads">{{ formatDownloads(extension.total_downloads) }} downloads</span>
							</div>
						</div>
					</NuxtLink>
				</div>
			</div>
		</BaseContainer>

		<!-- Request Extension CTA -->
		<BaseContainer spacing="large">
			<div class="cta-section">
				<BaseButton color="secondary" size="large" label="Request an Extension CTA" block href="/contact" />
			</div>
		</BaseContainer>
	</div>
</template>

<style scoped lang="scss">
.hero-section {
	display: grid;
	gap: var(--space-10);
	align-items: center;

	@media (width > 60rem) {
		grid-template-columns: 1fr 1fr;
		gap: var(--space-20);
	}
}

.hero-content {
	.hero-title {
		font-size: var(--font-size-4xl);
		line-height: var(--line-height-4xl);
		font-weight: 600;
		margin-bottom: var(--space-4);
		color: var(--foreground);
	}

	.hero-description {
		font-size: var(--font-size-lg);
		line-height: var(--line-height-lg);
		color: var(--gray-600);
		margin-bottom: var(--space-6);
	}
}

.hero-media {
	.hero-placeholder {
		aspect-ratio: 16/9;
		background: var(--gray-200);
		border-radius: var(--rounded-lg);
		display: flex;
		align-items: center;
		justify-content: center;
		color: var(--gray-500);
		font-size: var(--font-size-lg);
	}
}

.filters-section {
	display: grid;
	gap: var(--space-8);

	@media (width > 60rem) {
		grid-template-columns: 1fr auto;
		align-items: start;
	}
}

.search-container {
	.search-input {
		max-width: 20rem;
	}
}

.filter-group {
	.filter-title {
		font-size: var(--font-size-sm);
		font-weight: 600;
		color: var(--foreground);
		margin-bottom: var(--space-3);
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	.filter-options {
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
	}

	.filter-option {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		cursor: pointer;

		.filter-radio {
			margin: 0;
		}

		.filter-label {
			font-size: var(--font-size-sm);
			color: var(--foreground);
		}
	}
}

.extensions-grid {
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
	gap: var(--space-6);

	@media (width > 40rem) {
		grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
		gap: var(--space-8);
	}
}

.extension-card {
	height: 100%;

	.extension-link {
		display: block;
		height: 100%;
		text-decoration: none;
		color: inherit;
		border: 1px solid var(--gray-200);
		border-radius: var(--rounded-lg);
		overflow: hidden;
		transition: var(--duration-150) var(--ease-out);

		&:hover {
			border-color: var(--gray-300);
			box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
		}
	}
}

.extension-thumbnail {
	aspect-ratio: 16/9;
	overflow: hidden;

	.extension-image {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.extension-placeholder {
		width: 100%;
		height: 100%;
		background: var(--gray-100);
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: var(--font-size-sm);
		color: var(--gray-500);
	}
}

.extension-content {
	padding: var(--space-4);

	.extension-title {
		font-size: var(--font-size-base);
		font-weight: 600;
		margin-bottom: var(--space-2);
		color: var(--foreground);
		line-height: var(--line-height-tight);
	}

	.extension-description {
		font-size: var(--font-size-sm);
		line-height: var(--line-height-relaxed);
		color: var(--gray-600);
		margin-bottom: var(--space-3);
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}

	.extension-meta {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: var(--space-2);

		.extension-type {
			background: var(--primary-100);
			color: var(--primary);
			padding: var(--space-1) var(--space-2);
			border-radius: var(--rounded-md);
			font-size: var(--font-size-xs);
			font-weight: 600;
			text-transform: capitalize;
		}

		.extension-downloads {
			font-size: var(--font-size-xs);
			color: var(--gray-500);
		}
	}
}

.loading-state,
.empty-state {
	text-align: center;
	padding: var(--space-20) var(--space-4);
	color: var(--gray-600);
}

.empty-state {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: var(--space-4);
}

.marketplace-nav {
	text-align: center;

	.marketplace-title {
		font-size: var(--font-size-3xl);
		line-height: var(--line-height-3xl);
		font-weight: 600;
		margin-bottom: var(--space-8);
		color: var(--foreground);
	}

	.nav-tabs {
		display: flex;
		justify-content: center;
		gap: var(--space-2);
		list-style: none;
		margin: 0;
		padding: 0;

		@media (width < 40rem) {
			flex-direction: column;
			align-items: center;
		}
	}

	.nav-tab {
		display: block;
		padding: var(--space-3) var(--space-6);
		color: var(--gray-600);
		text-decoration: none;
		border-radius: var(--rounded-full);
		font-weight: 500;
		transition: var(--duration-150) var(--ease-out);
		transition-property: color, background-color;

		&:hover {
			color: var(--foreground);
			background-color: var(--gray-100);
		}

		&.active {
			color: var(--background);
			background-color: var(--primary);

			&:hover {
				background-color: var(--primary-500);
			}
		}
	}
}

.cta-section {
	max-width: 40rem;
	margin: 0 auto;
}
</style>
