import { $fetch } from 'ofetch';
import { createDirectus, rest, readItems, staticToken, readItem } from '@directus/sdk';
import type { MarketplaceExtension } from '~/types/marketplace';
import { formatTitle } from '@directus/format-title';
import { markdownToHtml, stripMarkdown } from '~~/utils/md';

interface ExtractedImages {
	featured_image?: string;
	images: string[];
}

const {
	marketplace: { registryUrl, registryToken },
} = useRuntimeConfig();

const marketplaceClient = createDirectus(registryUrl as string, {
	globals: {
		fetch: $fetch,
	},
})
	.with(rest())
	.with(staticToken(registryToken as string));

function convertRelativeToAbsolute(imageUrl: string, repositoryUrl: string): string {
	// If already absolute URL, return as is
	if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
		return imageUrl;
	}

	// Handle GitHub repository URLs
	if (repositoryUrl.includes('github.com')) {
		const githubBaseUrl = repositoryUrl.replace('github.com', 'raw.githubusercontent.com');
		const cleanBaseUrl = githubBaseUrl.replace(/\.git$/, '');

		// Remove leading slash from relative path
		const cleanImagePath = imageUrl.startsWith('./') ? imageUrl.substring(2) : imageUrl.replace(/^\//, '');

		// Construct absolute URL with main branch
		return `${cleanBaseUrl}/main/${cleanImagePath}`;
	}

	// For other git hosts, try to construct raw URL
	if (repositoryUrl.includes('gitlab.com')) {
		const cleanBaseUrl = repositoryUrl.replace(/\.git$/, '');
		const cleanImagePath = imageUrl.startsWith('./') ? imageUrl.substring(2) : imageUrl.replace(/^\//, '');
		return `${cleanBaseUrl}/-/raw/main/${cleanImagePath}`;
	}

	// For other repositories, just append the relative path
	const cleanBaseUrl = repositoryUrl.replace(/\.git$/, '');
	const cleanImagePath = imageUrl.startsWith('./') ? imageUrl.substring(2) : imageUrl.replace(/^\//, '');
	return `${cleanBaseUrl}/${cleanImagePath}`;
}

function processHtmlImages(html: string, repositoryUrl?: string): string {
	if (!repositoryUrl) return html;

	// Replace img src attributes with absolute URLs
	return html.replace(/<img([^>]+)src="([^"]+)"([^>]*>)/gi, (match, before, src, after) => {
		// Skip if already absolute URL
		if (src.startsWith('http://') || src.startsWith('https://')) {
			return match;
		}

		const absoluteUrl = convertRelativeToAbsolute(src, repositoryUrl);
		return `<img${before}src="${absoluteUrl}"${after}`;
	});
}

export function formatExtensionName(extension: any) {
	let name = extension.name;

	if (name.startsWith('@')) {
		name = name.split('/')[1]!;
	}

	if (name.startsWith('directus-extension-')) {
		name = name.substring('directus-extension-'.length);
	}

	return formatTitle(name);
}

export function extractImagesFromMarkdown(markdown: string, repositoryUrl?: string): ExtractedImages {
	if (!markdown) return { images: [] };

	const allImages: string[] = [];

	// Extract markdown images: ![alt](url)
	const markdownImageRegex = /!\[([^\]]*)\]\(([^)]+)\)/g;
	let match;

	while ((match = markdownImageRegex.exec(markdown)) !== null) {
		if (match[2]) {
			let imageUrl = match[2].trim();

			// Skip relative URLs if no repository URL is available
			if (!imageUrl.startsWith('http://') && !imageUrl.startsWith('https://')) {
				if (!repositoryUrl) continue; // Skip relative images without repository URL
				imageUrl = convertRelativeToAbsolute(imageUrl, repositoryUrl);
			}

			allImages.push(imageUrl);
		}
	}

	// Extract HTML img tags
	const htmlImageRegex = /<img[^>]+src="([^"]+)"/gi;

	while ((match = htmlImageRegex.exec(markdown)) !== null) {
		if (match[1]) {
			let imageUrl = match[1].trim();

			// Skip relative URLs if no repository URL is available
			if (!imageUrl.startsWith('http://') && !imageUrl.startsWith('https://')) {
				if (!repositoryUrl) continue; // Skip relative images without repository URL
				imageUrl = convertRelativeToAbsolute(imageUrl, repositoryUrl);
			}

			allImages.push(imageUrl);
		}
	}

	// Filter out badges and other non-content images
	const filteredImages = allImages.filter((imageUrl) => {
		const url = imageUrl.toLowerCase();

		// Skip empty or invalid URLs
		if (!imageUrl || imageUrl.length === 0) return false;

		// Filter out common badge services
		const badgeServices = [
			'badge.fury.io',
			'shields.io',
			'img.shields.io',
			'badgen.net',
			'github.com/badges',
			'travis-ci.org',
			'travis-ci.com',
			'circleci.com',
			'codecov.io',
			'coveralls.io',
			'npmjs.com/badge',
			'npmbadge.com',
			'david-dm.org',
			'nodei.co',
			'snyk.io',
			'gitpod.io/button',
		];

		// Filter out if URL contains any badge service
		const isBadge = badgeServices.some((service) => url.includes(service));

		// Filter out common badge file patterns
		const badgePatterns = [
			/badge\.svg$/,
			/shield\.svg$/,
			/status\.svg$/,
			/version\.svg$/,
			/license\.svg$/,
			/build\.svg$/,
			/coverage\.svg$/,
			/downloads\.svg$/,
			/npm\.svg$/,
			/node\.svg$/,
			/ci\.svg$/,
			/test\.svg$/,
		];

		const matchesBadgePattern = badgePatterns.some((pattern) => pattern.test(url));

		return !isBadge && !matchesBadgePattern;
	});

	// Remove duplicates
	const uniqueImages = [...new Set(filteredImages)];

	return {
		featured_image: uniqueImages[0],
		images: uniqueImages,
	};
}

function getLatestVersionRepositoryUrl(versions: any[]): string | undefined {
	if (!versions || versions.length === 0) return undefined;

	// Find the version with the latest publish_date that has a repository URL
	const latestVersion = versions
		.filter((version) => version.url_repository) // Only consider versions with repository URLs
		.sort((a, b) => {
			const dateA = new Date(a.publish_date || a.date_created || 0).getTime();
			const dateB = new Date(b.publish_date || b.date_created || 0).getTime();
			return dateB - dateA; // Sort descending (latest first)
		})[0];

	return latestVersion?.url_repository;
}

export function processExtension(extension: MarketplaceExtension): MarketplaceExtension {
	// Ensure versions exists before trying to get repository URL
	const repositoryUrl = extension.versions ? getLatestVersionRepositoryUrl(extension.versions) : undefined;

	const { featured_image, images } = extractImagesFromMarkdown(extension.readme || '', repositoryUrl || undefined);

	const formattedDescription = stripMarkdown(extension.description || '');

	const rawHtml = markdownToHtml(extension.readme || '');
	const processedHtml = rawHtml ? processHtmlImages(rawHtml, repositoryUrl || undefined) : undefined;

	const recentDownloads = extension.downloads?.reduce((acc, download) => acc + (download.count || 0), 0);

	return {
		...extension,
		formatted_name: formatExtensionName(extension),
		formatted_readme: processedHtml,
		formatted_description: formattedDescription,
		featured_image,
		images,
		repository_url: repositoryUrl,
		recent_downloads: recentDownloads,
	};
}

export { marketplaceClient, readItems, readItem };
