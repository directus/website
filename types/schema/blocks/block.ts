import type { BlockAccordionGroup } from './block-accordion-group.js';
import type { BlockAccordion } from './block-accordion.js';
import type { BlockButtonGroup } from './block-button-group.js';
import type { BlockButton } from './block-button.js';
import type { BlockCardGroup } from './block-card-group.js';
import type { BlockCard } from './block-card.js';
import type { BlockColumns } from './block-columns.js';
import type { BlockCta } from './block-cta.js';
import type { BlockFeatureGrid } from './block-feature-grid.js';
import type { BlockForm } from './block-form.js';
import type { BlockHeader } from './block-header.js';
import type { BlockLogoCloud } from './block-logo-cloud.js';
import type { BlockMedia } from './block-media.js';
import type { BlockMetricGroup, BlockMetricGroupItems } from './block-metric-group.js';
import type { BlockMetric } from './block-metric.js';
import type { BlockPaper } from './block-paper.js';
import type { BlockQuote } from './block-quote.js';
import type { BlockResourceSlider } from './block-resource-slider.js';
import type { BlockSeparator } from './block-separator.js';
import type { BlockShowcase } from './block-showcase.js';
import type { BlockSignature } from './block-signature.js';
import type { BlockTable } from './block-table.js';
import type { BlockTestimonialSlider } from './block-testimonial-slider.js';
import type { BlockTierGroup } from './block-tier-group.js';
import type { BlockTier } from './block-tier.js';

export type BlockType =
	| 'block_accordion_group'
	| 'block_accordion'
	| 'block_button_group'
	| 'block_button'
	| 'block_card_group'
	| 'block_card'
	| 'block_columns'
	| 'block_cta'
	| 'block_featuregrid'
	| 'block_form'
	| 'block_header'
	| 'block_logocloud'
	| 'block_media'
	| 'block_metric_group'
	| 'block_metric'
	| 'block_paper'
	| 'block_quote'
	| 'block_resource_slider'
	| 'block_richtext'
	| 'block_separator'
	| 'block_showcase'
	| 'block_signature'
	| 'block_table'
	| 'block_testimonial_slider'
	| 'block_tier_group'
	| 'block_tier';

export type Block =
	| BlockAccordion
	| BlockAccordionGroup
	| BlockButton
	| BlockButtonGroup
	| BlockCard
	| BlockCardGroup
	| BlockColumns
	| BlockCta
	| BlockFeatureGrid
	| BlockForm
	| BlockHeader
	| BlockLogoCloud
	| BlockMedia
	| BlockMetric
	| BlockMetricGroup
	| BlockMetricGroupItems
	| BlockPaper
	| BlockQuote
	| BlockResourceSlider
	| BlockSeparator
	| BlockShowcase
	| BlockSignature
	| BlockTable
	| BlockTestimonialSlider
	| BlockTier
	| BlockTierGroup;
