import type { BlockColumns } from './block-columns.js';
import type { BlockFeatureGrid } from './block-feature-grid.js';
import type { BlockHeroForm } from './block-hero-form.js';
import type { BlockHeroHeadline } from './block-hero-headline.js';
import type { BlockHeroRotator } from './block-hero-rotator.js';
import type { BlockLogoCloud } from './block-logo-cloud.js';
import type { BlockMediaFullWidth } from './block-media-full-width.js';
import type { BlockPageHeader } from './block-page-header.js';
import type { BlockSeparator } from './block-separator.js';
import type { BlockShowcase } from './block-showcase.js';
import type { BlockTestimonialSlider } from './block-testimonial-slider.js';

export type BlockType =
	| 'block_cardgroup'
	| 'block_columns'
	| 'block_featuregrid'
	| 'block_hero_form'
	| 'block_hero_headline'
	| 'block_hero_rotator'
	| 'block_logocloud'
	| 'block_media_fullwidth'
	| 'block_pageheader'
	| 'block_richtext'
	| 'block_separator'
	| 'block_separator'
	| 'block_showcase'
	| 'block_testimonial_slider';

export type Block =
	| BlockColumns
	| BlockFeatureGrid
	| BlockHeroForm
	| BlockHeroHeadline
	| BlockHeroRotator
	| BlockLogoCloud
	| BlockMediaFullWidth
	| BlockPageHeader
	| BlockSeparator
	| BlockShowcase
	| BlockTestimonialSlider;
