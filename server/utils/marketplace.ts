import { $fetch } from 'ofetch';
import { createDirectus, rest, readItems, staticToken, readItem } from '@directus/sdk';
import type { MarketplaceExtension } from '~/types/marketplace';
import { formatTitle } from '@directus/format-title';
import { markdownToHtml } from '~~/utils/md';

const {
	marketplace: { registryUrl, registryToken },
} = useRuntimeConfig();

// Create marketplace client with $fetch for better caching
const marketplaceClient = createDirectus(registryUrl as string, {
	globals: {
		fetch: $fetch,
	},
})
	.with(rest())
	.with(staticToken(registryToken as string));

interface ExtractedImages {
	featured_image?: string;
	images: string[];
}

export const formatExtensionName = (extension: any) => {
	let name = extension.name;

	if (name.startsWith('@')) {
		name = name.split('/')[1]!;
	}

	if (name.startsWith('directus-extension-')) {
		name = name.substring('directus-extension-'.length);
	}

	return formatTitle(name);
};

export function extractImagesFromMarkdown(markdown: string): ExtractedImages {
	if (!markdown) return { images: [] };

	const allImages: string[] = [];

	// Extract markdown images: ![alt](url)
	const markdownImageRegex = /!\[([^\]]*)\]\(([^)]+)\)/g;
	let match;

	while ((match = markdownImageRegex.exec(markdown)) !== null) {
		if (match[2]) {
			allImages.push(match[2]);
		}
	}

	// Extract HTML img tags
	const htmlImageRegex = /<img[^>]+src="([^"]+)"/gi;

	while ((match = htmlImageRegex.exec(markdown)) !== null) {
		if (match[1]) {
			allImages.push(match[1]);
		}
	}

	// Filter out badges and other non-content images
	const filteredImages = allImages.filter((imageUrl) => {
		const url = imageUrl.toLowerCase();

		// Filter out common badge services
		const badgeServices = [
			'badge.fury.io',
			'shields.io',
			'img.shields.io',
			'badgen.net',
			'github.com/badges',
			'travis-ci.org',
			'circleci.com',
			'codecov.io',
			'coveralls.io',
			'npmjs.com/badge',
			'david-dm.org',
			'nodei.co',
			'snyk.io',
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

// Process extension with enhanced image extraction
export function processExtension(extension: MarketplaceExtension): MarketplaceExtension {
	// Extract all images from readme
	const { featured_image, images } = extractImagesFromMarkdown(extension.readme);

	return {
		...extension,
		formatted_name: formatExtensionName(extension),
		formatted_readme: markdownToHtml(extension.readme),
		featured_image,
		images,
		// Keep the old image property for backward compatibility
		image: featured_image,
	};
}

export const marketplaceFilter = {
	and: [{ total_downloads: { _gte: 100 } }, { readme: { _nnull: true } }],
};

export const marketplaceFields = [
	'name',
	'description',
	'verified',
	'id',
	'readme',
	'type',
	'publisher.*',
	'last_updated',
	'host_version',
	'total_downloads',
	'sandbox',
	'license',
	'versions.*',
];

// Export marketplace client and functions
export { marketplaceClient, readItems, readItem };
