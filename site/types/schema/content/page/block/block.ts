import type { BlockColumns } from './block-columns.js';
import type { BlockFeatureGrid } from './block-feature-grid.js';
import type { BlockHeroForm } from './block-hero-form.js';
import type { BlockHeroHeadline } from './block-hero-headline.js';
import type { BlockHeroRotator } from './block-hero-rotator.js';
import type { BlockLogoCloud } from './block-logo-cloud.js';
import type { BlockMediaFullWidth } from './block-media-full-width.js';
import type { BlockPageHeader } from './block-page-header.js';
import type { BlockShowcase } from './block-showcase.js';

export type Block =
	| BlockColumns
	| BlockPageHeader
	| BlockLogoCloud
	| BlockFeatureGrid
	| BlockShowcase
	| BlockMediaFullWidth
	| BlockHeroForm
	| BlockHeroHeadline
	| BlockHeroRotator;
