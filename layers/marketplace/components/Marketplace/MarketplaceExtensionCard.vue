<script setup lang="ts">
import type { MarketplaceExtension } from '~/types/marketplace';
import { formatTimeAgo } from '~/utils/dates';
import { extensionTypeIconMap } from '~/layers/marketplace/utils/extension-type-icon-map';

interface MarketplaceExtensionCardProps {
	extension: MarketplaceExtension;
	to?: string;
	currentSort?: string;
}

const props = withDefaults(defineProps<MarketplaceExtensionCardProps>(), {});

const component = computed(() => (props.to ? resolveComponent('NuxtLink') : 'div'));
const imageLoadError = ref(false);

const timeframe = computed(() => {
	if (props.currentSort?.includes('recent_downloads_7_days')) {
		return '7d';
	}

	if (props.currentSort?.includes('recent_downloads_30_days')) {
		return '30d';
	}

	return '';
});

const formattedDownloads = computed(() => {
	let downloads = props.extension.total_downloads || 0;

	if (props.currentSort) {
		if (props.currentSort.includes('recent_downloads_7_days')) {
			downloads = props.extension.recent_downloads_7_days || 0;
		} else if (props.currentSort.includes('recent_downloads_30_days')) {
			downloads = props.extension.recent_downloads_30_days || 0;
		}
	}

	if (downloads === 0) return `0`;

	if (downloads >= 1_000_000) {
		return `${(downloads / 1_000_000).toFixed(1)}M`;
	}

	if (downloads >= 1_000) {
		return `${(downloads / 1_000).toFixed(1)}K`;
	}

	return `${downloads}`;
});

const publisher = computed(() => {
	return props.extension.publisher
		? {
				name:
					props.extension.publisher.name || props.extension.publisher.username || props.extension.publisher.github_name,
				avatar: props.extension.publisher.avatar || props.extension.publisher.github_avatar_url,
				verified: props.extension.publisher.verified ?? false,
			}
		: undefined;
});

const formattedDate = computed(() => {
	return props.extension.last_updated ? formatTimeAgo(props.extension.last_updated) : '';
});

const handleImageError = () => {
	imageLoadError.value = true;
};

watch(
	() => props.extension?.featured_image ?? '',
	() => {
		imageLoadError.value = false;
	},
);
</script>

<template>
	<component :is="component" :href="to" class="marketplace-card">
		<div class="featured-image">
			<img
				v-if="extension.featured_image && !imageLoadError"
				:src="extension.featured_image"
				:alt="extension.name"
				class="image"
				@error="handleImageError"
			/>
			<div v-else class="placeholder">
				<BaseIcon :name="extensionTypeIconMap[extension.type]" class="placeholder-icon" size="large" />
			</div>
		</div>

		<div class="content">
			<div class="header">
				<BaseBadge v-if="extension.type" :label="extension.type" class="badge" size="x-small" />

				<div class="stats">
					<div class="downloads">
						<BaseIcon name="download" class="download-icon" />
						<span>{{ formattedDownloads }}</span>
						<span v-if="timeframe" class="timeframe">({{ timeframe }})</span>
					</div>
				</div>
			</div>

			<h3 v-if="extension.name || extension.formatted_name" class="title">
				{{ extension.formatted_name ?? extension.name }}
			</h3>

			<p v-if="extension.formatted_description || extension.description" class="description">
				{{ extension.formatted_description ?? extension.description }}
			</p>

			<div class="footer">
				<div v-if="publisher" class="publisher">
					<div class="publisher-avatar">
						<img v-if="publisher.avatar" :src="publisher.avatar" :alt="publisher.name" class="avatar-image" />
						<BaseIcon v-else name="account_circle" class="avatar-placeholder-icon" />
					</div>

					<div class="publisher-info">
						<span class="publisher-name">{{ publisher.name }}</span>
						<BaseIcon v-if="publisher.verified" name="verified" class="verified-icon" />
					</div>
				</div>

				<div v-if="formattedDate" class="updated-date">
					<BaseIcon name="update" class="update-icon" size="small" />
					<span>{{ formattedDate }}</span>
				</div>
			</div>
		</div>
	</component>
</template>

<style lang="scss" scoped>
.marketplace-card {
	display: flex;
	gap: var(--space-4);
	padding: var(--space-4);
	border-radius: var(--rounded-lg);
	border: 1px solid var(--gray-200);
	background-color: var(--background);
	color: var(--foreground);
	text-decoration: none;
	transition: all var(--duration-200) var(--ease-out);
	height: 100%;
	min-width: 0;

	&:hover {
		border-color: var(--gray-300);
		box-shadow: 0 4px 12px rgb(0 0 0 / 10%);
		transform: translateY(-2px);

		.title {
			color: var(--primary);
		}

		.image {
			scale: 1.05;
		}
	}

	&:focus {
		outline: none;
		border-color: var(--primary);
		box-shadow: 0 0 0 3px var(--primary-100);
	}

	&:focus-visible {
		outline: none;
		border-color: var(--primary);
		box-shadow: 0 0 0 3px var(--primary-100);
	}
}

.featured-image {
	flex-shrink: 0;
	width: 120px;
	height: 120px;
	border-radius: var(--rounded-md);
	overflow: hidden;
	background-color: var(--gray-100);
	display: flex;
	align-items: center;
	justify-content: center;

	.image {
		width: 100%;
		height: 100%;
		object-fit: cover;
		transition: scale var(--duration-300) var(--ease-out);
	}

	.placeholder {
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		background-color: var(--primary-50);
	}

	.placeholder-icon {
		width: var(--space-15);
		height: var(--space-15);
		color: var(--primary-400);
	}
}

.content {
	flex: 1;
	display: flex;
	flex-direction: column;
	gap: var(--space-2);
	min-width: 0;
	overflow: hidden;
}

.header {
	display: flex;
	align-items: center;
	justify-content: space-between;
	margin-bottom: var(--space-1);
}

.stats {
	display: flex;
	align-items: center;
	gap: var(--space-3);
}

.downloads {
	display: flex;
	align-items: center;
	gap: var(--space-1);
	color: var(--foreground);
	font-size: var(--font-size-sm);
	font-weight: 500;
}

.title {
	font-size: var(--font-size-lg);
	font-weight: 600;
	line-height: var(--line-height-lg);
	margin: 0;
	color: var(--foreground);
	transition: color var(--duration-200) var(--ease-out);
}

.description {
	color: var(--gray-600);
	font-size: var(--font-size-sm);
	line-height: var(--line-height-sm);
	margin: 0;
	flex: 1;
	display: -webkit-box;
	-webkit-line-clamp: 3;
	line-clamp: 3;
	-webkit-box-orient: vertical;
	overflow: hidden;
	word-wrap: break-word;
}

.footer {
	display: flex;
	align-items: center;
	justify-content: space-between;
	margin-top: auto;
	gap: var(--space-2);
	min-width: 0;
}

.publisher {
	display: flex;
	align-items: center;
	gap: var(--space-2);
	min-width: 0;
	flex: 1 1 auto;
}

.publisher-avatar {
	width: var(--space-6);
	height: var(--space-6);
	border-radius: var(--rounded-full);
	overflow: hidden;
	display: flex;
	align-items: center;
	justify-content: center;
	flex-shrink: 0;
	background-color: var(--gray-100);

	.avatar-image {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.avatar-placeholder-icon {
		width: var(--space-6);
		height: var(--space-6);
		color: var(--gray-400);
	}
}

.publisher-info {
	display: flex;
	align-items: center;
	gap: var(--space-1);
	min-width: 0;
}

.publisher-name {
	font-size: var(--font-size-sm);
	color: var(--gray-600);
	font-weight: 500;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
}

.verified-icon {
	color: var(--primary);
}

.updated-date {
	font-size: var(--font-size-xs);
	color: var(--gray-500);
	white-space: nowrap;
	flex-shrink: 0;
	display: flex;
	align-items: center;
	gap: var(--space-1);
}

@container (width <= 24rem) {
	.marketplace-card {
		flex-direction: column;
		gap: var(--space-3);
	}

	.featured-image {
		width: 100%;
		height: 120px;
	}

	.header {
		flex-direction: column;
		align-items: flex-start;
		gap: var(--space-2);
	}
}

.timeframe {
	font-size: var(--font-size-xs);
	color: var(--gray-500);
	white-space: nowrap;
}
</style>
