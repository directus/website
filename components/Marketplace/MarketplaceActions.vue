<script setup lang="ts">
import type { MarketplaceExtension } from '~/types/marketplace';
import { formatFilesize } from '~/utils/formatFilesize';

const props = defineProps<{
	extension: MarketplaceExtension;
	buttons: any[];
}>();

const directusInstanceUrl = useCookie('directus-instance-url', {
	default: () => '',
});

const showInstallModal = ref(false);
const inputUrl = ref(directusInstanceUrl.value || '');

const installExtension = () => {
	if (!inputUrl.value) {
		return;
	}

	directusInstanceUrl.value = inputUrl.value;

	const installUrl = `${inputUrl.value}/admin/settings/marketplace/extension/${props.extension.id}`;

	navigateTo(installUrl, {
		external: true,
		open: {
			target: '_blank',
		},
	});

	showInstallModal.value = false;
};

const handleInstallClick = () => {
	if (!directusInstanceUrl.value) {
		// Show modal if no URL is set
		showInstallModal.value = true;
		inputUrl.value = '';
	} else {
		// Go directly to marketplace if URL is already set
		const installUrl = `${directusInstanceUrl.value}/admin/settings/marketplace/extension/${props.extension.id}`;

		navigateTo(installUrl, {
			external: true,
			open: {
				target: '_blank',
			},
		});
	}
};

const handleEditUrl = () => {
	showInstallModal.value = true;
	inputUrl.value = directusInstanceUrl.value;
};

const isSandboxed = computed(() => {
	return props.extension.type === 'sandbox' || props.extension.sandbox;
});

const formatDownloads = (count: number): string => {
	if (count >= 1000000) {
		return `${(count / 1000000).toFixed(1)}M`;
	}

	if (count >= 1000) {
		return `${(count / 1000).toFixed(1)}k`;
	}

	return count.toString();
};

const installCommand = computed(() => {
	const npmName = props.extension?.name?.toLowerCase().replace(/\s+/g, '-') || '';
	return `npm i ${npmName}`;
});

// Format date to relative format
const formatDate = (dateString: string): string => {
	const date = new Date(dateString);
	const now = new Date();
	const diffInMonths = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24 * 30));

	if (diffInMonths === 0) {
		return 'Updated recently';
	} else if (diffInMonths === 1) {
		return 'Updated 1 month ago';
	} else if (diffInMonths < 12) {
		return `Updated ${diffInMonths} months ago`;
	} else {
		const years = Math.floor(diffInMonths / 12);
		return years === 1 ? 'Updated 1 year ago' : `Updated ${years} years ago`;
	}
};

// Get latest version
const latestVersion = computed(() => {
	if (!props.extension.versions?.length) return null;
	return props.extension.versions[0];
});
</script>

<template>
	<div class="extension-actions">
		<div class="install-box">
			<BaseHeading tag="h3" :content="extension?.name" size="small" />
			<BaseButton label="Install Extension" color="primary" size="large" block @click="handleInstallClick" />

			<BaseCliSnippet :command="installCommand" size="x-small" />
			<button v-if="directusInstanceUrl" type="button" class="text-link" @click="handleEditUrl">
				<BaseIcon name="edit" size="small" class="icon" />
				Edit Directus URL
			</button>

			<BaseText
				size="x-small"
				color="subdued"
				:content="`This extension is ${isSandboxed ? 'sandboxed and can be installed through the Directus Marketplace.' : 'not sandboxed and can only be installed in self-hosted instances using npm.'} <a href='https://directus.io/docs/self-hosting/including-extensions' target='_blank'>Learn more</a>.`"
			/>
		</div>

		<dl class="meta">
			<div v-if="extension?.publisher" class="row">
				<dd class="author-info">
					<img
						v-if="extension.publisher.github_avatar_url"
						:src="extension.publisher.github_avatar_url"
						:alt="extension.publisher.github_name || extension.publisher.username"
						class="avatar"
					/>
					<div class="author-details">
						<span class="author-name">{{ extension.publisher.github_name || extension.publisher.username }}</span>
						<BaseBadge v-if="extension.publisher.verified" label="Verified" color="primary" size="small" />
					</div>
				</dd>
			</div>

			<div v-if="extension?.total_downloads" class="row">
				<span class="meta-item">
					<BaseIcon name="cloud_download" size="small" />
					{{ formatDownloads(extension.total_downloads) }} Downloads
				</span>
			</div>

			<div v-if="latestVersion" class="row">
				<span class="meta-item">
					<BaseIcon name="sell" size="small" />
					{{ latestVersion.version }}
				</span>
			</div>

			<div v-if="extension?.last_updated" class="row">
				<span class="meta-item">
					<BaseIcon name="calendar_month" size="small" />
					{{ formatDate(extension.last_updated) }}
				</span>
			</div>

			<div v-if="extension?.license" class="row">
				<span class="meta-item">
					<BaseIcon name="copyright" size="small" />
					{{ extension.license }} License
				</span>
			</div>

			<div v-if="latestVersion?.unpacked_size && latestVersion.file_count" class="row">
				<span class="meta-item">
					<BaseIcon name="folder_open" size="small" />
					{{ formatFilesize(latestVersion.unpacked_size, false) }} ({{ latestVersion.file_count }} files)
				</span>
			</div>

			<div v-if="extension?.name" class="row">
				<span class="meta-item">
					<BaseIcon name="fa6-brands:npm" size="small" />
					<NuxtLink :href="`https://www.npmjs.com/package/${extension.name}`" target="_blank" class="link">
						npm
					</NuxtLink>
				</span>
			</div>

			<div v-if="latestVersion?.url_repository" class="row">
				<span class="meta-item">
					<BaseIcon name="fa6-brands:github" size="small" />
					<a :href="latestVersion.url_repository" target="_blank" class="link">Repository</a>
				</span>
			</div>

			<div v-if="latestVersion?.url_bugs" class="row">
				<span class="meta-item">
					<BaseIcon name="bug_report" size="small" />
					<a :href="latestVersion.url_bugs" target="_blank" class="link">Report Issue</a>
				</span>
			</div>

			<div v-if="extension?.verified" class="row">
				<span class="meta-item">Verified</span>
			</div>
		</dl>

		<!-- Install Modal -->
		<BaseModal v-model:open="showInstallModal" title="Set Directus Instance URL" size="small">
			<template #content>
				<div class="install-modal">
					<form class="modal-content" @submit.prevent="installExtension">
						<BaseText
							content="Enter your Directus instance URL to install this extension directly into your"
							size="small"
							color="foreground"
						/>
						<BaseText
							content="This will open a new tab with the extension ready to install."
							size="small"
							color="foreground"
						/>
						<BaseInput
							v-model="inputUrl"
							placeholder="https://your-directus-instance.com"
							type="url"
							class="url-input"
						/>
						<div class="modal-buttons">
							<BaseButton label="Save & Install Extension" color="primary" :disabled="!inputUrl" type="submit" block />
							<BaseButton
								type="button"
								label="Cancel"
								color="secondary"
								outline
								@click.prevent="showInstallModal = false"
								block
							/>
						</div>
					</form>
				</div>
			</template>
		</BaseModal>
	</div>
</template>

<style scoped lang="scss">
.extension-actions {
	> * + * {
		margin-block-start: var(--space-6);
	}
}

.install-box {
	background: var(--gray-50);
	border: 1px solid var(--gray-200);
	border-radius: var(--rounded-lg);
	padding: var(--space-4);
	margin-bottom: var(--space-6);
	overflow: hidden;
	container-type: inline-size;

	> * + * {
		margin-top: var(--space-3);
	}

	.text-link {
		background: none;
		border: none;
		color: var(--primary-500);
		cursor: pointer;
		font-size: var(--font-size-sm);
		padding: 0;
		text-align: center;
		margin-top: var(--space-4);
		width: 100%;
		max-width: 100%;
		display: flex;
		align-items: center;
		gap: var(--space-1);

		&:hover {
			color: var(--primary-600);
			text-decoration: underline;
		}
	}

	h4 {
		margin: 0;
		margin-bottom: var(--space-2);
	}

	.docs-link {
		margin: 0;
		font-size: var(--font-size-sm);
		color: var(--gray-600);
	}

	@container (max-width: 250px) {
		padding: var(--space-3);

		h4 {
			font-size: var(--font-size-sm);
		}

		:deep(.base-cli-snippet) {
			font-size: var(--font-size-xs);
		}

		:deep(.base-button) {
			font-size: var(--font-size-sm);
			padding: var(--space-2) var(--space-3);
			min-height: auto;
		}
	}

	:deep(.base-button) {
		max-width: 100%;
		width: 100%;
		box-sizing: border-box;
		word-wrap: break-word;
		white-space: normal;
	}
}

.subdued {
	color: var(--gray-600);
}

.flex-list {
	display: flex;
	align-items: center;
	flex-wrap: wrap;
	gap: var(--space-2);
}

.meta {
	container-type: inline-size;

	& > * + * {
		margin-block-start: var(--space-2);
	}

	.row {
		display: flex;
	}

	.meta-item {
		font-size: var(--font-size-sm);
		color: var(--gray-600);
		display: flex;
		align-items: center;
		gap: var(--space-2);
		flex-wrap: wrap;
		word-break: break-word;
	}

	/* Container query for very narrow containers */
	@container (max-width: 200px) {
		.meta-item {
			font-size: var(--font-size-xs);
			gap: var(--space-0-5);
		}

		& > * + * {
			margin-block-start: var(--space-2);
		}
	}

	.link {
		color: var(--primary-500);
		text-decoration: none;

		&:hover {
			text-decoration: underline;
		}
	}

	.author-info {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		justify-content: start;
		margin-inline-start: 0px;
	}

	.avatar {
		width: 32px;
		height: 32px;
		border-radius: 50%;
		object-fit: cover;
	}

	.author-details {
		display: flex;
		align-items: center;
		gap: var(--space-1);
	}

	.author-name {
		font-weight: 500;
	}

	.verified-badge {
		color: var(--green-500);
		font-weight: 600;
	}
}

.install-modal {
	max-width: 400px;
	margin: 0 auto;

	.modal-content {
		background: var(--white);
		border-radius: var(--rounded-lg);
		padding: var(--space-4);
		display: flex;
		flex-direction: column;
		gap: var(--space-4);
		overflow: hidden;

		.url-input {
			width: 100%;
			max-width: 100%;
			box-sizing: border-box;
		}

		.modal-buttons {
			display: flex;
			flex-direction: column;
			gap: var(--space-3);
			margin-top: var(--space-2);
			width: 100%;

			:deep(.base-button) {
				max-width: 100%;
				width: 100%;
				box-sizing: border-box;
				word-wrap: break-word;
				white-space: normal;
			}
		}
	}
}
</style>
