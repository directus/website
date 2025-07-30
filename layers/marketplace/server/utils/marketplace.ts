import { $fetch } from 'ofetch';
import { createDirectus, rest, readItems, staticToken } from '@directus/sdk';
import type { MarketplaceExtension } from '~/types/marketplace';
import { formatTitle } from '@directus/format-title';
import { markdownToHtml, stripMarkdown } from '~~/utils/md';
import { consola } from 'consola';

interface ExtractedImages {
	featured_image?: string;
	images: string[];
}

interface ImageValidationOptions {
	timeout?: number;
	concurrency?: number;
}

interface ImageReachabilityResult {
	url: string;
	reachable: boolean;
}

const DEFAULT_VALIDATION_OPTIONS: ImageValidationOptions = {
	timeout: 5000,
	concurrency: 5,
};

const BADGE_SERVICES = [
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
] as const;

const BADGE_PATTERNS = [
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
] as const;

const DIRECTUS_EXTENSION_PREFIX = 'directus-extension-';

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

// Helper functions
function isAbsoluteUrl(url: string): boolean {
	return url.startsWith('http://') || url.startsWith('https://');
}

function normalizeRelativePath(path: string): string {
	if (path.startsWith('./')) {
		return path.substring(2);
	}

	return path.replace(/^\//, '');
}

function getGitHostRawUrl(repositoryUrl: string, imagePath: string): string {
	const cleanBaseUrl = repositoryUrl.replace(/\.git$/, '');
	const cleanImagePath = normalizeRelativePath(imagePath);

	// GitHub
	if (repositoryUrl.includes('github.com')) {
		const githubBaseUrl = cleanBaseUrl.replace('github.com', 'raw.githubusercontent.com');
		return `${githubBaseUrl}/main/${cleanImagePath}`;
	}

	// GitLab
	if (repositoryUrl.includes('gitlab.com')) {
		return `${cleanBaseUrl}/-/raw/main/${cleanImagePath}`;
	}

	// Default fallback
	return `${cleanBaseUrl}/${cleanImagePath}`;
}

function convertRelativeToAbsolute(imageUrl: string, repositoryUrl: string): string {
	if (isAbsoluteUrl(imageUrl)) {
		return imageUrl;
	}

	return getGitHostRawUrl(repositoryUrl, imageUrl);
}

function processHtmlImages(html: string, repositoryUrl?: string): string {
	if (!repositoryUrl) return html;

	// Use a more robust regex pattern and handle edge cases
	return html.replace(/<img([^>]*?)src\s*=\s*["']([^"']+)["']([^>]*?)>/gi, (match, before, src, after) => {
		if (isAbsoluteUrl(src)) {
			return match;
		}

		const absoluteUrl = convertRelativeToAbsolute(src, repositoryUrl);
		return `<img${before}src="${absoluteUrl}"${after}>`;
	});
}

export function formatExtensionName(extension: { name: string }): string {
	let name = extension.name;

	// Handle scoped packages
	if (name.startsWith('@')) {
		const parts = name.split('/');
		name = parts[1] || name;
	}

	// Remove common prefixes
	if (name.startsWith(DIRECTUS_EXTENSION_PREFIX)) {
		name = name.substring(DIRECTUS_EXTENSION_PREFIX.length);
	}

	return formatTitle(name);
}

function isBadgeImage(imageUrl: string): boolean {
	const url = imageUrl.toLowerCase();

	// Check for badge services
	if (BADGE_SERVICES.some((service) => url.includes(service))) {
		return true;
	}

	// Check for badge patterns
	return BADGE_PATTERNS.some((pattern) => pattern.test(url));
}

function extractImagesFromString(content: string): string[] {
	const images: string[] = [];

	// Extract markdown images: ![alt](url)
	const markdownImageRegex = /!\[([^\]]*)\]\(([^)]+)\)/g;
	let match;

	while ((match = markdownImageRegex.exec(content)) !== null) {
		const imageUrl = match[2]?.trim();

		if (imageUrl) {
			images.push(imageUrl);
		}
	}

	// Extract HTML img tags with more flexible pattern
	const htmlImageRegex = /<img[^>]*?src\s*=\s*["']([^"']+)["'][^>]*?>/gi;

	while ((match = htmlImageRegex.exec(content)) !== null) {
		const imageUrl = match[1]?.trim();

		if (imageUrl) {
			images.push(imageUrl);
		}
	}

	return images;
}

export function extractImagesFromMarkdown(markdown: string, repositoryUrl?: string): ExtractedImages {
	if (!markdown) return { images: [] };

	const rawImages = extractImagesFromString(markdown);

	// Process and filter images
	const processedImages = rawImages
		.map((imageUrl) => {
			// Skip empty URLs
			if (!imageUrl) return null;

			// Convert relative URLs if repository URL is available
			if (!isAbsoluteUrl(imageUrl)) {
				if (!repositoryUrl) return null;
				return convertRelativeToAbsolute(imageUrl, repositoryUrl);
			}

			return imageUrl;
		})
		.filter((url): url is string => url !== null)
		.filter((url) => !isBadgeImage(url));

	// Remove duplicates while preserving order
	const uniqueImages = [...new Set(processedImages)];

	return {
		featured_image: uniqueImages[0],
		images: uniqueImages,
	};
}

function getLatestVersionRepositoryUrl(
	versions: Array<{ url_repository?: string | null; publish_date?: string; date_created?: string }>,
): string | undefined {
	if (!versions?.length) return undefined;

	// Find the version with the latest date that has a repository URL
	const versionWithRepo = versions
		.filter((version) => version.url_repository)
		.sort((a, b) => {
			const dateA = new Date(a.publish_date || a.date_created || 0).getTime();
			const dateB = new Date(b.publish_date || b.date_created || 0).getTime();
			return dateB - dateA;
		})[0];

	return versionWithRepo?.url_repository || undefined;
}

async function testImageReachability(imageUrl: string, timeout: number): Promise<boolean> {
	const controller = new AbortController();
	const timeoutId = setTimeout(() => controller.abort(), timeout);

	try {
		const response = await $fetch.raw(imageUrl, {
			method: 'HEAD',
			signal: controller.signal,
			redirect: 'manual',
		});

		clearTimeout(timeoutId);

		// Consider 2xx and 3xx status codes as reachable
		return response.status >= 200 && response.status < 400;
	} catch {
		clearTimeout(timeoutId);
		return false;
	}
}

async function processBatch<T>(
	items: T[],
	batchSize: number,
	processor: (item: T) => Promise<ImageReachabilityResult>,
	delayBetweenBatches = 100,
): Promise<ImageReachabilityResult[]> {
	const results: ImageReachabilityResult[] = [];

	for (let i = 0; i < items.length; i += batchSize) {
		const batch = items.slice(i, i + batchSize);
		const batchResults = await Promise.all(batch.map(processor));
		results.push(...batchResults);

		// Add delay between batches if not the last batch
		if (i + batchSize < items.length && delayBetweenBatches > 0) {
			await new Promise((resolve) => setTimeout(resolve, delayBetweenBatches));
		}
	}

	return results;
}

export async function testImagesReachability(
	imageUrls: string[],
	options: ImageValidationOptions = {},
): Promise<ImageReachabilityResult[]> {
	const { timeout = DEFAULT_VALIDATION_OPTIONS.timeout!, concurrency = DEFAULT_VALIDATION_OPTIONS.concurrency! } =
		options;

	if (!imageUrls.length) return [];

	const processor = async (url: string): Promise<ImageReachabilityResult> => ({
		url,
		reachable: await testImageReachability(url, timeout),
	});

	return processBatch(imageUrls, concurrency, processor);
}

export async function filterReachableImages(
	imageUrls: string[],
	options: ImageValidationOptions = {},
): Promise<string[]> {
	const results = await testImagesReachability(imageUrls, options);
	return results.filter((result) => result.reachable).map((result) => result.url);
}

function calculateRecentDownloads(
	downloads: Array<{ date: string; count?: number }> | undefined,
	days: number,
): number {
	if (!downloads?.length) return 0;

	const cutoffDate = new Date();
	cutoffDate.setDate(cutoffDate.getDate() - days);

	return downloads
		.filter((download) => new Date(download.date) >= cutoffDate)
		.reduce((sum, download) => sum + (download.count || 0), 0);
}

export async function processExtension(
	extension: MarketplaceExtension,
	validateImages = true,
	imageValidationOptions: ImageValidationOptions = {},
): Promise<MarketplaceExtension> {
	// Early return for minimal processing
	if (!extension) {
		throw new Error('Extension is required');
	}

	const repositoryUrl = extension.versions ? getLatestVersionRepositoryUrl(extension.versions) : undefined;

	const { featured_image, images } = extractImagesFromMarkdown(extension.readme || '', repositoryUrl);

	const formattedDescription = stripMarkdown(extension.description || '');

	const rawHtml = markdownToHtml(extension.readme || '');
	const processedHtml = rawHtml ? processHtmlImages(rawHtml, repositoryUrl) : undefined;

	const recentDownloads7Days = calculateRecentDownloads(extension.downloads, 7);
	const recentDownloads30Days = calculateRecentDownloads(extension.downloads, 30);

	let finalFeaturedImage = featured_image;
	let finalImages = images;

	// Validate images if requested
	if (validateImages && images.length > 0) {
		try {
			const validatedImages = await filterReachableImages(images, imageValidationOptions);

			// Update featured image only if it's reachable
			if (featured_image && !validatedImages.includes(featured_image)) {
				finalFeaturedImage = undefined;
			}

			finalImages = validatedImages;
		} catch (error) {
			// Log error for debugging but continue processing
			consola.error('Image validation failed:', error);
			// Keep original images on validation failure
		}
	}

	return {
		...extension,
		formatted_name: formatExtensionName(extension),
		formatted_readme: processedHtml,
		formatted_description: formattedDescription,
		featured_image: finalFeaturedImage,
		images: finalImages,
		repository_url: repositoryUrl,
		recent_downloads_7_days: recentDownloads7Days,
		recent_downloads_30_days: recentDownloads30Days,
	};
}

export { marketplaceClient, readItems };
